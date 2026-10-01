import { Router } from 'express';// objeto Router de express para definir rutas de la API   
import { register, login, profile } from '../controllers/auth.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();// instancia de Router 

// RUTAS AUTENTICACION

router.post('/register', register);// ruta para registrar un nuevo usuario, se llama a la funcion register del controlador auth.controllers.js
router.post('/login', login);// ruta para iniciar sesión, se llama a la funcion login 
router.get('/profile', requireAuth, profile);// ruta a perfil autorizado, primero ejecuta el middleware para verificar el token JWT y luego
// llama a la funcion profile

export default router;// exporta el router para que pueda ser usado en otros archivos, como en el archivo principal de la aplicación donde se 
// configuran las rutas de la API