// Middleware para verificar que el usuario tenga uno de los roles permitidos

// lo que hace esta funcion es recibir un array de roles permitidos( que lo recibe del controlador ) y devolver 
// un middleware que verifica si el rol del usuario autenticado (almacenado en req.user.role) está dentro de los roles permitidos
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Si req.user no existe o no tiene rol definido
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'Acceso no autorizado: Identidad o rol no identificado'
      });
    }

    // Verificar si el rol del usuario está dentro de los permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acceso denegado: Se requiere uno de los siguientes roles [${allowedRoles.join(', ')}]`
      });
    }

    // Si tiene el rol adecuado, continúa la petición
    next();
  };
};