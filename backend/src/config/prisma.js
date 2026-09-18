// lo que hace este  archivo es instaciar  prisma globalmante, para que no se creen multiples instancias de prisma en desarrollo,para que
//  se pueda reutilizar la misma instancia de prisma en toda la aplicacion, y para que se pueda exportar la instancia de prisma para que pueda 
// ser utilizada en otras partes de la aplicacion

// importar el cliente de Prisma para interactuar con la base de datos
import { PrismaClient } from '@prisma/client';


//  se accede a la variable global de node para almacenar la instancia de PrismaClient y evitar múltiples instancias en desarrollo
const globalForPrisma = global;

// se reutiliza la instancia de PrismaClient si ya existe, de lo contrario se crea una nueva instancia 
export const prisma = globalForPrisma.prisma || new PrismaClient({
  // esto hace que en modo de desarrollo se muestren las consultas, errores y advertencias en la consola, mientras que en producción solo se muestren los errores
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// en modo de desarrollo, se asigna la instancia de PrismaClient a la variable global para que pueda ser reutilizada en futuras importaciones
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// se exporta la instancia de PrismaClient para que pueda ser utilizada en otras partes de la aplicación, se exporta default para que pueda
//  ser importada con cualquier nombre en otros archivos.. antes tambien se exporto named export para que pueda ser importada con su nombre original en otros archivos
export default prisma;