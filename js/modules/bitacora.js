/* =========================================================
   Cuentas Claras MVP
   Bitácora básica
   ========================================================= */

window.CC_BITACORA = (function () {
  const MAX_LOGS = 200;

  function log(action, entity, registroId = null, detalle = "") {
    const session =
      window.CC_AUTH && window.CC_AUTH.getSession
        ? window.CC_AUTH.getSession()
        : null;

    const id = window.CC_STORAGE.nextId("LOG");

    const entry = {
      id,
      usuarioId: session ? session.userId : "SYSTEM",
      accion: action,
      entidad: entity,
      registroId,
      fecha: window.CC_UTILS.nowISO(),
      detalle
    };

    const logs = window.CC_STORAGE.list("logs");
    logs.unshift(entry);

    if (logs.length > MAX_LOGS) {
      logs.length = MAX_LOGS;
    }

    window.CC_STORAGE.setList("logs", logs);

    return entry;
  }

  function list(limit = 50) {
    const logs = window.CC_STORAGE.list("logs");
    return logs.slice(0, limit);
  }

  function clearOldLogs(keep = 100) {
    const logs = window.CC_STORAGE.list("logs");
    const trimmed = logs.slice(0, keep);
    window.CC_STORAGE.setList("logs", trimmed);
    return trimmed.length;
  }

  return {
    log,
    list,
    clearOldLogs
  };
})();