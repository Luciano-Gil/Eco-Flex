/**
 * ============================================================================
 * CORAZÓN PRINCIPAL DE LA APLICACIÓN EXPRESS (src/app.js)
 * ============================================================================
 * Este archivo centraliza los middlewares de seguridad y la configuración
 * general antes de exponer las rutas de la API de EcoFlex.
 * ============================================================================
 */

import express from 'express';
import { helmetMiddleware, corsOptions, globalRateLimiter } from './config/security.js';

// Inicialización de la instancia principal de Express
const app = express();

/**
 * MIDDLEWARES DE SEGURIDAD GLOBAL
 */
app.use(globalRateLimiter); // 1. Filtra volumen de peticiones (Rate Limit)
app.use(helmetMiddleware);  // 2. Protege encabezados HTTP (Helmet)
app.use(corsOptions);       // 3. Controla dominios autorizados (CORS)

/**
 * PARSEO DE JSON
 */
app.use(express.json({ limit: '10mb' })); // Lectura de cuerpos JSON con límite de 10 MB

// Exporta la app configurada para ser encendida o probada
export default app;