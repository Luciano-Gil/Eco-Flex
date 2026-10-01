import jwt from 'jsonwebtoken';// librería de autenticación de tokens JWT
import { jwtConfig } from '../../config/jwt.config.js'; // archivo donde configure clave secreta y tiempo de expiración del token

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;//  de la cabecera de autorización( contiene el token JWT en el formato Bearer <token>)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Acceso denegado: Token no proporcionado o formato inválido' 
    });
  }

  const token = authHeader.split(' ')[1];// extraigo el token del encabezado de autorización, split hace que se divida la cadena en un array 
  // y se toma el segundo elemento (el token en sí)

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();// next lo envia a la siguiente funcion definida en la ruta, que en este caso es profile
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión expirada. Inicie sesión nuevamente' });
    }
    return res.status(403).json({ message: 'Token inválido o manipulado' });
  }
};