import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { uploadDriverDocs } from '../middlewares/upload.middleware.js';
import { uploadDocuments } from '../controllers/driver.controller.js';

const router = Router();

// ============================================================================
// RUTA: SUBIR DOCUMENTACIÓN DEL CHOFER
// ============================================================================
// 1. requireAuth: exige token JWT válido
// 2. requireRole('DRIVER'): exige que sea chofer
// 3. uploadDriverDocs.fields: intercepta y guarda en disco los 3 archivos
// 4. uploadDocuments: controlador final que valida y persiste
router.post(
  '/documents',
  requireAuth,
  requireRole('DRIVER'),
  uploadDriverDocs.fields([
    { name: 'license', maxCount: 1 },
    { name: 'vtv', maxCount: 1 },
    { name: 'insurance', maxCount: 1 }
  ]),
  uploadDocuments
);

export default router;