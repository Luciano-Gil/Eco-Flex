import { prisma } from '../config/prisma.js';

// servicio que registra y actualiza la documentacion del chofer en la tabla driver_docs:
// Recibe el ID del chofer autenticado, el CUIT y las rutas relativas de los 3 archivos
// Guarda el registro en la tabla 'driver_docs' con estado 'PENDING'.
export const submitDriverDocuments = async (driverId, { cuit, licenseUrl, vtvUrl, insuranceUrl }) => {
  // Verificamos si el CUIT ya está registrado por otro chofer diferente
  const existingDocWithCuit = await prisma.driverDoc.findUnique({
    where: { cuit }
  });

  if (existingDocWithCuit && existingDocWithCuit.driverId !== driverId) {
    const error = new Error('El CUIT ingresado ya se encuentra registrado por otro usuario');
    error.statusCode = 409;
    throw error;
  }

  // upsert: si el chofer ya tenía un registro lo actualiza, si no existe lo crea
  const documentRecord = await prisma.driverDoc.upsert({
    where: {
      driverId: driverId // driverId es único en el modelo
    },
    update: {
      cuit,
      licenseUrl,
      vtvUrl,
      insuranceUrl,
      status: 'PENDING',       // Vuelve a quedar en revisión
      rejectionNote: null      // Limpia cualquier rechazo previo
    },
    create: {
      driverId,
      cuit,
      licenseUrl,
      vtvUrl,
      insuranceUrl,
      status: 'PENDING'
    }
  });

  return documentRecord;
};