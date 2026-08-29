/**
 * ============================================================================
 * ARCHIVO DE CONFIGURACIÓN DE SEGURIDAD GLOBAL (security.js)
 * ============================================================================
 * 
 * Explicación de las 3 librerías instaladas:
 * 
 * 1. HELMET: Oculta la firma del servidor (Express) en los encabezados HTTP
 *    para evitar que atacantes sepan qué tecnología usamos.
 * 
 * 2. CORS: Define qué páginas web (dominios) tienen permiso para llamar
 *    a nuestro backend y evita que sitios maliciosos usen sesiones de usuarios.
 * 
 * 3. EXPRESS-RATE-LIMIT: Limita la cantidad de peticiones por IP en un tiempo
 *    determinado para proteger la memoria RAM contra ataques masivos (DDoS).
 * ============================================================================
 */

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Lista de direcciones web (dominios) permitidas para consultar la API
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://ecoflex.com'] // Dominio cuando la página esté subida a internet
  : ['http://localhost:5173', 'http://localhost:3000']; // Direcciones de tu computadora local

// Configuración de la librería CORS
export const corsOptions = cors({
  // La función origin se ejecuta automáticamente en cada petición entrante
  origin: (origin, callback) => {
    // Si la petición NO tiene origen (ej: Thunder Client) O si la dirección está en allowedOrigins:
    if (!origin || allowedOrigins.includes(origin)) {
      // Posición 1: null (sin errores) | Posición 2: true (acceso permitido)
      callback(null, true);
    } else {
      // Si la dirección web no está permitida, se envía un objeto de Error y se bloquea
      callback(new Error('Acceso no permitido por las políticas de CORS de EcoFlex'));
    }
  },
  
  //  credential es una función que indica si se permiten cookies y cabeceras de autenticación en las peticiones CORS, es de que sirve para permitir que
  //  el navegador envíe cookies y cabeceras de autenticación en las solicitudes CORS, lo cual es útil cuando se necesita mantener la sesión del usuario entre el cliente y el servidor.
  credentials: true,
});

// Configuración de Helmet (aplica encabezados de seguridad por defecto)
export const helmetMiddleware = helmet();

// Configuración del limitador de velocidad (Rate Limit)
export const globalRateLimiter = rateLimit({
  // Ventana de tiempo: 15 minutos pasados a milisegundos (15 min * 60 seg * 1000 ms)
  windowMs: 15 * 60 * 1000, 
  
  // Límite máximo: 100 peticiones por cada IP dentro de esos 15 minutos
  max: 100, 
  
  // Muestra información del límite en los encabezados de respuesta
  standardHeaders: true, 
  
  // Desactiva encabezados viejos y obsoletos
  legacyHeaders: false, 
  
  // Respuesta enviada al usuario si supera las 100 peticiones
  message: {
    status: 429,
    error: 'Demasiadas peticiones desde esta IP. Intente nuevamente en 15 minutos.',
  },
});