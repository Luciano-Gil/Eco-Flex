import { Router } from 'express';// objeto Router de express para definir rutas de la API   
import { register, login, profile, logout } from '../controllers/auth.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();// instancia de Router 

// RUTAS AUTENTICACION

// Rutas publicas:

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout); // ruta para cerrar sesión

// Ruta protegida común (para cualquier usuario con token válido):

router.get('/profile', requireAuth, profile);// ruta a perfil autorizado, primero ejecuta el middleware para verificar el token JWT y luego
// llama a la funcion profile

// RUTAS PROTEGIDAS POR ROL

// Exclusiva administradores:

router.get('/admin-dashboard', requireAuth, requireRole('ADMIN'), (req, res) => {
  res.status(200).json({
    message: 'Bienvenido al panel de Administrador'
  });
});

// Exclusiva choferes / transportistas:

router.get('/driver-dashboard', requireAuth, requireRole('DRIVER'), (req, res) => {
  res.status(200).json({
    message: 'Bienvenido al panel de Transportista'
  });
});

// Exclusiva para clientes / dadores de carga:

router.get('/client-dashboard', requireAuth, requireRole('CLIENT'), (req, res) => {
  res.status(200).json({
    message: 'Bienvenido al panel de Cliente'
  });
});

export default router;// exporta el router para que pueda ser usado en otros archivos, como en el archivo principal de la aplicación donde se 
// configuran las rutas de la API