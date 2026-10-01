/**
 * ARCHIVO DE CONFIGURACIÓN DE SEGURIDAD GLOBAL (security.js)
 *  librerías instaladas:
 * 
 * HELMET: Oculta la firma del servidor (Express) en los encabezados HTTP para evitar que atacantes sepan qué tecnología usada
 * 
 * CORS: Define qué páginas web (dominios) tienen permiso para llamar al backend y evita que sitios maliciosos usen sesiones de usuarios
 * 
 * EXPRESS-RATE-LIMIT: Limita la cantidad de peticiones http por IP en un tiempo determinado para proteger la memoria RAM contra ataques masivos (DDoS)
 */

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Lista de dominios permitidos para consultar la API
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://ecoflex.com'] // Dominio cuando la página esté subida a internet
  : ['http://localhost:5173', 'http://localhost:3000']; // Direcciones de la compu local

// Configuración de la librería CORS
export const corsOptions = cors({
  // La función origin se ejecuta automáticamente en cada petición entrante, pasa de parametro el atributo origin de la cabecera HTTP y
  //  un callback para indicar si se permite o no el acceso
  origin: (origin, callback) => {
    // Si la petición no tiene origen (ej: Thunder Client) o si la dirección está en allowedOrigins:
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);// null (sin errores) true (acceso permitido)
    } else {
      callback(new Error('Acceso no permitido por las políticas de CORS de EcoFlex'));// dirección web no permitida, se envía un objeto de Error y se bloquea
    }
  },
  
  //  credential es una función que indica si se permiten cookies y cabeceras de autenticación en las peticiones CORS, es de que sirve para permitir que
  //  el navegador envíe cookies y cabeceras de autenticación en las solicitudes CORS, lo cual es útil cuando se necesita mantener la sesión del usuario entre el cliente y el servidor.
  credentials: true,
});

// Configuración de Helmet (aplica encabezados de seguridad por defecto como por ejemplo los que hacen el imframe sea cargado en u dominio propio y no en otro,
//  evitando ataques de clickjacking)
export const helmetMiddleware = helmet(); // agrega encabezados HTTP de seguridad a las respuestas del servidor, ocultando información sensible y
//  protegiendo contra ataques comunes como XSS, clickjacking y otros


// Configuración del limitador de velocidad (Rate Limit)
export const globalRateLimiter = rateLimit({
  // Ventana de tiempo: 15 minutos pasados a milisegundos (15 min * 60 seg * 1000 ms)
  windowMs: 15 * 60 * 1000, 
  
  // Límite máximo: 100 peticiones por cada IP dentro de esos 15 minutos
  max: 100, 
  
  // Muestra información del límite en los encabezados de respuesta, es decir que el servidor incluirá información sobre el límite de peticiones
  //  en los encabezados de respuesta HTTP, lo que permite a los clientes conocer cuántas solicitudes les quedan antes de alcanzar el límite.
  standardHeaders: true, 
  
  // Desactiva encabezados viejos y obsoletos
  legacyHeaders: false, 
  
  // Respuesta enviada al usuario si supera las 100 peticiones
  message: {
    status: 429,
    error: 'Demasiadas peticiones desde esta IP. Intente nuevamente en 15 minutos.',
  },
});