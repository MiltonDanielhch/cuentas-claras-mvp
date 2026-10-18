/* =========================================================
   Cuentas Claras MVP
   Autenticación simulada para prototipo académico
   ========================================================= */

window.CC_AUTH = (function () {
  const cfg = window.CC_CONFIG;
  const storage = window.CC_STORAGE;
  const utils = window.CC_UTILS;

  function getUsers() {
    return storage.list("users");
  }

  function findUser(usuario) {
    return (
      getUsers().find(
        (user) =>
          user.usuario === usuario &&
          user.estado === "activo"
      ) || null
    );
  }

  function login(usuario, password) {
    storage.ensureSeedAuto();

    const user = findUser(usuario);

    if (!user) {
      return {
        ok: false,
        message: "Usuario no encontrado o inactivo."
      };
    }

    const hash = utils.hashPassword(password);

    if (user.passwordHash !== hash) {
      return {
        ok: false,
        message: "Contraseña incorrecta."
      };
    }

    const session = {
      userId: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      rol: user.rol,
      loginAt: utils.nowISO(),
      activo: true
    };

    storage.setSessionRaw(session);

    if (window.CC_BITACORA) {
      window.CC_BITACORA.log(
        "login",
        "users",
        user.id,
        `Ingreso de ${user.usuario}`
      );
    }

    return {
      ok: true,
      session
    };
  }

  function logout() {
    const session = getSession();

    if (session && window.CC_BITACORA) {
      window.CC_BITACORA.log(
        "logout",
        "users",
        session.userId,
        `Salida de ${session.usuario}`
      );
    }

    storage.clearSessionRaw();
  }

  function getSession() {
    const session = storage.getSessionRaw();

    if (
      !session ||
      typeof session !== "object" ||
      !session.userId ||
      !session.usuario
    ) {
      return null;
    }

    return session;
  }

  function isAuthenticated() {
    return !!getSession();
  }

  function requireAuth(redirect = true) {
    if (isAuthenticated()) {
      return true;
    }

    if (redirect) {
      window.location.replace(cfg.routes.login);
    }

    return false;
  }

  function hasRole(role) {
    const session = getSession();
    return session ? session.rol === role : false;
  }

  function isAdmin() {
    return hasRole(cfg.roles.administrador);
  }

  return {
    login,
    logout,
    getSession,
    isAuthenticated,
    requireAuth,
    hasRole,
    isAdmin
  };
})();