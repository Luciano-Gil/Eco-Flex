/**
 * CONTROLADOR DE AUTENTICACIÓN (auth.controllers.js)
 * Responsabilidad:
 *  - Interceptar peticiones HTTP entrantes (req)
 *  - Extraer parámetros de entrada (body, headers, context)
 *  - Validar presencia básica de campos obligatorios 
 *  - Delega trabajo pesado a servicios (auth.service.js)
 *  - Mapea excepciones o respuestas a códigos de estado hhttp (200, 201, 400, 401, 500)
 *  - Emite  respuesta serializada en formato Json (res)
 */

import * as authService from '../../services/auth.service.js';

// Endpoint: POST /api/auth/register
 //Registra un nuevo usuario 
export const register = async (req, res) => {
  try {
    // Extrae los parámetros del cuerpo de la petición
    const { email, password, role, name, phone } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ 
        message: 'Email, Contraseña y Rol son obligatorios' 
      });
    }

    // Delega la lógica de creación y cifrado al servicio
    const { user, token } = await authService.registerUser({
      email,
      password,
      role,
      name,
      phone
    });

    // Respuesta exitosa con código 201 Created y token en payload
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user
    });
  } catch (error) {
    // Si el servicio arrojó un error con código HTTP específico (ej. 409 Conflict)
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    // Manejo de fallas no controladas (errores de conexión a DB, caída de librerías)
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

//Endpoint: POST /api/auth/login
//  Autentica un usuario y genera su token Bearer

export const login = async (req, res) => {
  try {
    // Extrae  credenciales
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña requeridos' 
      });
    }

    // Delega la verificación y firma de token al servicio
    const { user, token } = await authService.loginUser({ email, password });

    // Respuesta exitosa  y token de autorización
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user
    });
  } catch (error) {
    // Si las credenciales fallan, devuelve el 401 provisto por el servicio
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Endpoint: GET /api/auth/profile
 //Devuelve la información del usuario actualmente autenticado
 //Requiere que el middleware 'requireAuth' haya inyectado req.user previamente
export const profile = async (req, res) => {
  try {
    // Delega a servicio usando el ID de usuario proveniente del JWT decodificado
    const user = await authService.getUserProfile(req.user.userId);

    // Retorno de la ficha del usuario en formato JSON
    return res.status(200).json({ user });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error('Error en profile:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

//Endpoint: POST /api/auth/logout
//Cierre de sesión para clientes con token en cabecera Bearer. En arquitecturas stateless, el backend no mantiene estado de sesión, por lo que el logout es principalmente informativo. El cliente debe descartar el token en su frontend para "cerrar sesión".
// En arquitecturas stateless sin cookies, el cliente descarta el token en su frontend.

export const logout = async (req, res) => {
  return res.status(200).json({
    message: 'Sesión cerrada exitosamente'
  });
};