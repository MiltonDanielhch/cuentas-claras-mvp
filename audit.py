#!/usr/bin/env python3
"""
Project Auditor v2.3 — Web Frontend Edition (HTML, CSS, Bootstrap, JS)
======================================================================
Auditoría especializada para proyectos web estáticos o dinámicos basados
en HTML, CSS, SCSS, JavaScript y frameworks/librerías como Bootstrap.

Uso:
    python audit_web.py
    python audit_web.py /path/to/project --output reporte_web.md
    python audit_web.py . --json --skip-empty
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Iterator

# ── Optional dependencies ──────────────────────────────────────────────────────
try:
    from tqdm import tqdm
except ImportError:
    tqdm = None  # type: ignore[misc,assignment]

# ── Constants ──────────────────────────────────────────────────────────────────
DEFAULT_IGNORE = {
    ".git",
    ".gitignore",
    ".dockerignore",
    ".DS_Store",
    ".vscode",
    ".idea",
    ".astro",
    "__pycache__",
    ".venv",
    ".env",
    "uploads",
    "archive",
    "test-results",
    "playwright-report",
    ".next",
    ".nuxt",
    ".svelte-kit",
}

DEPENDENCY_DIRS = {
    "vendor",
    "node_modules",
    "build",
    "dist",
    "coverage",
    ".pytest_cache",
}

# 🆕 Restricción estricta de extensiones permitidas para web (HTML, CSS, JS, etc.)
WEB_EXTENSIONS = {
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".js",
    ".mjs",
    ".ts",
    ".tsx",
}

COMMENT_PATTERNS = {
    ".js": ("//", "/*"),
    ".mjs": ("//", "/*"),
    ".ts": ("//", "/*"),
    ".tsx": ("//", "/*"),
    ".css": (None, "/*"),
    ".scss": ("//", "/*"),
    ".html": (None, "<!--"),
    ".htm": (None, "<!--"),
}


# ── Data classes ────────────────────────────────────────────────────────────
@dataclass
class FileMetrics:
    path: Path
    lines_total: int = 0
    lines_blank: int = 0
    lines_comment: int = 0
    lines_code: int = 0
    size: int = 0

    @property
    def ext(self) -> str:
        return self.path.suffix.lower()


@dataclass
class DirMetrics:
    path: Path
    files: list[FileMetrics] = field(default_factory=list)
    subdirs: list[DirMetrics] = field(default_factory=list)
    _cached_lines: int | None = field(default=None, repr=False)
    _cached_size: int | None = field(default=None, repr=False)

    @property
    def total_lines(self) -> int:
        if self._cached_lines is None:
            self._cached_lines = sum(f.lines_code for f in self.files) + sum(
                d.total_lines for d in self.subdirs
            )
        return self._cached_lines

    @property
    def total_size(self) -> int:
        if self._cached_size is None:
            self._cached_size = sum(f.size for f in self.files) + sum(
                d.total_size for d in self.subdirs
            )
        return self._cached_size

    @property
    def file_count(self) -> int:
        return len(self.files) + sum(d.file_count for d in self.subdirs)

    @property
    def total_comments(self) -> int:
        return sum(f.lines_comment for f in self.files) + sum(
            d.total_comments for d in self.subdirs
        )


# ── Helpers ─────────────────────────────────────────────────────────────────
def human_size(b: int, factor: int = 1024, suffix: str = "B") -> str:
    for unit in ("", "K", "M", "G", "T", "P"):
        if abs(b) < factor:
            return f"{b:.2f}{unit}{suffix}"
        b /= factor
    return f"{b:.2f}E{suffix}"


def summarize_dependency(directory: Path) -> tuple[int, int]:
    file_count = 0
    total_size = 0
    try:
        for entry in directory.rglob('*'):
            if entry.is_file() and not entry.is_symlink():
                file_count += 1
                try:
                    total_size += entry.stat().st_size
                except OSError:
                    pass
    except (OSError, PermissionError):
        pass
    return file_count, total_size


def is_binary(file_path: Path, sample_size: int = 8192) -> bool:
    try:
        with open(file_path, "rb") as f:
            chunk = f.read(sample_size)
    except OSError:
        return True
    if not chunk:
        return False
    if b"\x00" in chunk:
        return True
    text_chars = bytearray({7, 8, 9, 10, 12, 13, 27} | set(range(0x20, 0x100)) - {0x7F})
    non_text = chunk.translate(None, text_chars)
    return bool(non_text) and len(non_text) / len(chunk) > 0.30


def parse_gitignore(root: Path) -> set[str]:
    gitignore = root / ".gitignore"
    patterns: set[str] = set()
    if not gitignore.exists():
        return patterns
    try:
        with open(gitignore, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or line.startswith("!"):
                    continue
                patterns.add(line.rstrip("/"))
    except OSError:
        pass
    return patterns


def matches_any(name: str, patterns: set[str]) -> bool:
    for pat in patterns:
        if fnmatch.fnmatch(name, pat) or name == pat:
            return True
    return False


def count_lines_advanced(file_path: Path) -> FileMetrics:
    fm = FileMetrics(path=file_path, size=file_path.stat().st_size)

    if fm.ext not in WEB_EXTENSIONS or is_binary(file_path):
        return fm

    line_comment, block_comment = COMMENT_PATTERNS.get(fm.ext, (None, None))

    in_block = False
    block_end = None
    if block_comment == "/*":
        block_end = "*/"
    elif block_comment == "<!--":
        block_end = "-->"

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            for raw_line in f:
                line = raw_line.rstrip("\n\r")
                fm.lines_total += 1

                stripped = line.strip()
                if not stripped:
                    fm.lines_blank += 1
                    continue

                if in_block:
                    fm.lines_comment += 1
                    if block_end and block_end in stripped:
                        in_block = False
                    continue

                if block_end and block_comment and block_comment in stripped:
                    start_idx = stripped.find(block_comment)
                    end_idx = stripped.find(block_end, start_idx + len(block_comment))
                    if end_idx != -1:
                        before = stripped[:start_idx].strip()
                        if before:
                            fm.lines_code += 1
                        else:
                            fm.lines_comment += 1
                        continue
                    else:
                        fm.lines_comment += 1
                        in_block = True
                        continue

                if line_comment and stripped.startswith(line_comment):
                    fm.lines_comment += 1
                    continue

                fm.lines_code += 1
    except (OSError, UnicodeDecodeError):
        pass

    return fm


def should_ignore(
    path: Path, root: Path, ignore_names: set[str], gitignore: set[str]
) -> bool:
    name = path.name
    if name in ignore_names or matches_any(name, gitignore):
        return True
    return False


def analyze_directory(
    directory: Path,
    root: Path,
    ignore_names: set[str],
    gitignore: set[str],
    prefix: str = "",
    progress: tqdm | None = None,
    skip_empty: bool = False,
) -> tuple[str, DirMetrics]:
    tree_lines: list[str] = []
    dm = DirMetrics(path=directory)

    try:
        entries = sorted(
            [
                e
                for e in directory.iterdir()
                if not should_ignore(e, root, ignore_names, gitignore)
            ],
            key=lambda e: (e.is_dir(), e.name.lower()),
        )
    except PermissionError:
        tree_lines.append(f"{prefix}[Acceso Denegado]\n")
        return "\n".join(tree_lines), dm
    except OSError:
        return "", dm

    for idx, entry in enumerate(entries):
        is_last = idx == len(entries) - 1
        connector = "└── " if is_last else "├── "
        child_prefix = prefix + ("    " if is_last else "│   ")

        if entry.is_symlink():
            target = os.readlink(entry)
            tree_lines.append(
                f"{prefix}{connector}{entry.name} -> {target} (symlink)\n"
            )
            continue

        is_dependency = entry.name in DEPENDENCY_DIRS

        if entry.is_dir() and is_dependency:
            file_count, size = summarize_dependency(entry)
            sub_dm = DirMetrics(path=entry)
            sub_dm._cached_size = size
            dm.subdirs.append(sub_dm)
            tree_lines.append(
                f"{prefix}{connector}{entry.name}/ [{human_size(size)} | {file_count} archivos | dependencias omitidas]\n"
            )
            continue

        if entry.is_dir():
            subtree, sub_dm = analyze_directory(
                entry, root, ignore_names, gitignore, child_prefix, progress, skip_empty
            )
            dm.subdirs.append(sub_dm)
            tree_lines.append(
                f"{prefix}{connector}{entry.name}/ [{human_size(sub_dm.total_size)}]\n"
            )
            tree_lines.append(subtree)
        else:
            if entry.suffix.lower() not in WEB_EXTENSIONS:
                continue  # Ocultar archivos que no sean HTML, CSS o JS

            fm = count_lines_advanced(entry)
            if skip_empty and fm.size == 0 and fm.lines_code == 0:
                continue
            dm.files.append(fm)
            if progress:
                progress.update(1)
            info = f"({fm.lines_code} LoC | {human_size(fm.size)})"
            if fm.lines_comment:
                info += f" [{fm.lines_comment} comentarios]"
            tree_lines.append(f"{prefix}{connector}{entry.name} {info}\n")

    return "".join(tree_lines), dm


def build_layer_table(
    dm: DirMetrics,
    total_lines: int,
    total_size: int,
    depth: int = 1,
) -> str:
    lines_out: list[str] = [
        "| Capa / Directorio | Archivos | LoC | Comentarios | Peso | % LoC |",
        "| :--- | ---: | ---: | ---: | ---: | ---: |",
    ]

    def collect_layers(
        current: DirMetrics, current_depth: int
    ) -> Iterator[tuple[str, int, int, int, int]]:
        if current_depth > depth:
            return
        file_count = len(current.files)
        loc = sum(f.lines_code for f in current.files)
        comments = sum(f.lines_comment for f in current.files)
        size = sum(f.size for f in current.files)

        if current_depth >= 1 and (loc > 0 or file_count > 0):
            rel_name = current.path.name or "."
            yield (rel_name, file_count, loc, comments, size)

        for sub in current.subdirs:
            if current_depth < depth:
                yield from collect_layers(sub, current_depth + 1)
            else:
                if sub.path.name in DEPENDENCY_DIRS:
                    continue
                yield (sub.path.name, sub.file_count, sub.total_lines, 0, sub.total_size)

    layers = list(collect_layers(dm, 0))
    layers.sort(key=lambda x: x[2], reverse=True)

    for name, files, loc, comments, size in layers:
        pct = (loc / total_lines * 100) if total_lines > 0 else 0
        bar = "█" * int(pct / 5)
        lines_out.append(
            f"| `{name}` | {files} | {loc} | {comments} | {human_size(size)} | {pct:.1f}% {bar} |"
        )

    lines_out.append(
        f"| **TOTAL WEB** | — | **{total_lines}** | — | **{human_size(total_size)}** | 100% |"
    )
    return "\n".join(lines_out)


def build_extension_table(dm: DirMetrics) -> str:
    stats: dict[str, dict[str, int]] = {}

    def walk(d: DirMetrics) -> None:
        for f in d.files:
            ext = f.ext
            if ext not in stats:
                stats[ext] = {"files": 0, "loc": 0, "size": 0}
            stats[ext]["files"] += 1
            stats[ext]["loc"] += f.lines_code
            stats[ext]["size"] += f.size
        for sub in d.subdirs:
            walk(sub)

    walk(dm)
    if not stats:
        return ""

    lines_out = [
        "## Desglose por Extensión Web\n",
        "| Extensión | Archivos | LoC | Peso |",
        "| :--- | ---: | ---: | ---: |",
    ]
    for ext, data in sorted(stats.items(), key=lambda x: x[1]["loc"], reverse=True):
        lines_out.append(
            f"| `{ext}` | {data['files']} | {data['loc']} | {human_size(data['size'])} |"
        )
    return "\n".join(lines_out)


def generate_audit(args: argparse.Namespace) -> None:
    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"❌ Error: {root} no es un directorio válido.", file=sys.stderr)
        sys.exit(1)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    root_name = root.name

    ignore_names = set(DEFAULT_IGNORE)
    if args.ignore:
        ignore_names.update(args.ignore.split(","))

    gitignore: set[str] = set()
    if not args.no_gitignore:
        gitignore = parse_gitignore(root)

    total_files = 0
    if tqdm:
        for root_dir, dirs, files in os.walk(root):
            dirs[:] = [d for d in dirs if d not in ignore_names and d not in DEPENDENCY_DIRS]
            filtered_files = [f for f in files if f not in ignore_names and Path(f).suffix.lower() in WEB_EXTENSIONS]
            total_files += len(filtered_files)

    progress = tqdm(total=total_files, desc="Analizando Frontend", unit="arch") if tqdm else None

    tree_content, dm = analyze_directory(
        root, root, ignore_names, gitignore, progress=progress, skip_empty=args.skip_empty
    )

    if progress:
        progress.close()

    total_lines = dm.total_lines
    total_size = dm.total_size

    layer_table = build_layer_table(dm, total_lines, total_size, depth=args.depth)
    ext_table = build_extension_table(dm)

    report_parts = [
        f"# 🌐 Auditoría Frontend (HTML, CSS/Bootstrap, JS) — {root_name}\n",
        f"> Generado: `{timestamp}`\n",
        "## Resumen Web\n",
        "| Métrica | Valor |",
        "| :--- | :--- |",
        f"| **Proyecto** | `{root_name}` |",
        f"| **Líneas de Código Frontend** | {total_lines} LoC |",
        f"| **Peso Total Web** | {human_size(total_size)} |",
        f"| **Archivos Web analizados** | {dm.file_count} |",
        "",
        "## Desglose por Capa\n",
        layer_table,
    ]

    if ext_table:
        report_parts += ["", ext_table]

    report_parts += [
        "",
        "## Mapa de Arquitectura Frontend\n",
        "```text",
        f"{root_name}/",
        tree_content.rstrip(),
        "```",
    ]

    report = "\n".join(report_parts) + "\n"

    if args.json:
        data = {
            "project": root_name,
            "timestamp": timestamp,
            "total_lines": total_lines,
            "total_size": total_size,
            "total_files": dm.file_count,
            "tree": tree_content,
        }
        report = json.dumps(data, indent=2, ensure_ascii=False)

    output_path = Path(args.output)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"✅ Auditoría Frontend completada [{timestamp}]")
    print(f"   Proyecto  : {root_name}/")
    print(f"   Total LoC : {total_lines}")
    print(f"   Peso      : {human_size(total_size)}")
    print(f"   Archivos  : {dm.file_count}")
    print(f"   Reporte   : {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Auditoría enfocada en HTML, CSS, Bootstrap y JS."
    )
    parser.add_argument("root", nargs="?", default=".", help="Directorio raíz a auditar")
    parser.add_argument("-o", "--output", default="AUDITORIA_WEB.md", help="Archivo de salida")
    parser.add_argument("-d", "--depth", type=int, default=1, help="Profundidad del breakdown")
    parser.add_argument("--ignore", default="", help="Nombres extra a ignorar separados por comas")
    parser.add_argument("--no-gitignore", action="store_true", help="No leer .gitignore")
    parser.add_argument("--json", action="store_true", help="Exportar como JSON")
    parser.add_argument("--skip-empty", action="store_true", help="Omitir archivos vacíos")
    args = parser.parse_args()
    generate_audit(args)


if __name__ == "__main__":
    main()