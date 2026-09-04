/**
 * archivo principal de configuración de la aplicación Express, se encarga de centralizar los middlewares de seguridad
 *  y la configuración general antes de exponer las rutas de la API
 */

import express from 'express';
import { helmetMiddleware, corsOptions, globalRateLimiter } from './config/security.js'; // se importan los middlewares de seguridad desde el archivo de configuración

// se inicializa la instancia principal de Express
const app = express();

// middlewares globales de seguridad y configuración general
app.use(globalRateLimiter); // filtra volumen de peticiones de una misma IP (Rate Limiter)
app.use(helmetMiddleware);  // protege encabezados HTTP, al eliminar informacion del stack usaado (Helmet) 
app.use(corsOptions);       // controla dominios autorizados (CORS)

// indica que la app use el parseo de cuerpos JSON con un límite de tamaño de 10 MB
app.use(express.json({ limit: '10mb' })); //indica limite de 10mb, para evitar ataques de denegación de servicio (DoS) por cuerpos muy grandes

// Ruta de verificación rápida es de prueba para arrncar el seridor y muestre el mensaje
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API de EcoFlex funcionando correctamente' });
});

// exportacion por defecto de la app para ser usada o encendida desde el archivo principal del servidor (server.js)
export default app;