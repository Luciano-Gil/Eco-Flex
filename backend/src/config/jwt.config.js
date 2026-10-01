
// archivo que lee las variables de entorno de forma segura para no depender de process.env disperso, es decir, centraliza la configuración
//  de JWT en un solo lugar. Esto facilita el mantenimiento y la seguridad del código, ya que las variables sensibles no se encuentran directamente 
// en el código fuente



import dotenv from 'dotenv';
// dotenv es una biblioteca q lee las variables de entorno desde el archivo .env en el disco rigido y las carga en process.env para que puedan ser 
// accedidas de manera segura y centralizada . mantiene  las credenciales y configuraciones sensibles fuera del código fuente, 
// mejorand seguridad y facilitando la gestión de diferentes entornos (desarrollo, pruebas, producción)
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'clave_secreta_por_defecto_desarrollo',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h'
};