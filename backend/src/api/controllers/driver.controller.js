import * as driverService from '../../services/driver.service.js';

// ============================================================================
// CONTROLADOR: SUBIDA DE DOCUMENTACIÓN
// ============================================================================
export const uploadDocuments = async (req, res) => {
  try {
    const { cuit } = req.body;
    const files = req.files;

    // Validación: que el CUIT esté presente
    if (!cuit) {
      return res.status(400).json({ message: 'El número de CUIT es obligatorio' });
    }

    // Validación: que los 3 archivos requeridos hayan sido procesados por Multer
    if (!files || !files.license || !files.vtv || !files.insurance) {
      return res.status(400).json({
        message: 'Debes adjuntar los tres comprobantes obligatorios: license, vtv e insurance'
      });
    }

    // Construimos las rutas de texto (Strings) para guardar en la base de datos
    const licenseUrl = `/uploads/${files.license[0].filename}`;
    const vtvUrl = `/uploads/${files.vtv[0].filename}`;
    const insuranceUrl = `/uploads/${files.insurance[0].filename}`;

    // req.user.userId viene del token JWT verificado por requireAuth
    const driverId = req.user.userId;

    // Delegamos la persistencia al servicio
    const docRecord = await driverService.submitDriverDocuments(driverId, {
      cuit,
      licenseUrl,
      vtvUrl,
      insuranceUrl
    });

    return res.status(201).json({
      message: 'Documentación enviada correctamente. Se encuentra en estado de revisión.',
      data: docRecord
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error en uploadDocuments:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};