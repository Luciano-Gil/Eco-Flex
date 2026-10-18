import multer from 'multer';
import path from 'path';// libreria nativa de Node.js para manejo de rutas de archivos y directorios, lo que permite extraer la extensión del archivo original y construir un nombre único para evitar colisiones
import fs from 'fs';// libreria nativa de Node.js para manejo de archivos y directorios en disco,lo que permite crear la carpeta 'uploads/' si no existe, evitando errores de Multer al guardar archivos


// garantia de existencia de directorio en disco 

// Como la carpeta 'uploads/' está excluida en el archivo .gitignore, cuando el
// proyecto se clone en otra máquina o se ejecute en Docker/CI-CD, la carpeta
// no existirá. Si Multer intenta escribir en una ruta inexistente, Node.js
// arroja una excepción fatal (ENOENT) y detiene el servidor.
// fs.existsSync verifica si la ruta ya está creada; si no está, fs.mkdirSync
// la genera automáticamente en tiempo de arranque
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// guardado y renonbrado unico(diskStorage) 
// Multer utiliza el patrón de diseño "Callback" (cb) para no bloquear el hilo
// principal mientras gestiona operaciones de entrada/salida en el disco.
// La convención de Node.js exige pasar dos argumentos a cb:
// 1 El error (si no hubo problemas, se envía 'null')
// 2 El valor resuelto (la ruta de la carpeta o el nombre final)
const storage = multer.diskStorage({
  // Indica a qué carpeta física del disco debe enviarse el archivo recibido
  destination: (req, file, cb) => {
    // cb(null, uploadDir) le confirma a Multer: "Sin errores, guardalo en 'uploads/'"
    cb(null, uploadDir);
  },

  // Genera un identificador único para el nombre físico del archivo
  // Evita que dos usuarios sobreescriban archivos si ambos suben "licencia.jpg"
  filename: (req, file, cb) => {
    // Genera una marca de tiempo en milisegundos combinada con un número aleatorio
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    // Extrae la extensión original del archivo (.png, .jpg, .pdf) desde file.originalname
    const extension = path.extname(file.originalname);

    // Arma el nombre final seguro: "campo-milisegundos-azar.extension"
    // Ejemplo resultante: "license-1760805600000-5839201.pdf"
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// FILTRO DE FORMATOS PERMITIDOS (fileFilter)

// Inspecciona el tipo MIME de cada archivo recibido (mime es una cabecera HTTP que indica el tipo de contenido del archivo, como 'image/jpeg' o 'application/pdf')
// Solo permite imágenes (JPEG, PNG) y documentos PDF, bloqueando ejecutables
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Archivo válido: continúa el proceso
    cb(null, true);
  } else {
    // Archivo no permitido: rechaza la petición
    cb(new Error('Formato de archivo no permitido. Solo se aceptan JPG, PNG y PDF.'), false);
  }
};


// CREACIÓN Y EXPORTACIÓN DEL MIDDLEWARE (uploadDriverDocs)

// Acá se ensambla la instancia de Multer que importamos en driver.routes.js:
// - storage: usa la configuración de disco definida arriba
// - limits.fileSize: fija el límite de 5 MB por archivo (5 * 1024 * 1024 bytes)
// - fileFilter: aplica la validación de extensiones permitidas
export const uploadDriverDocs = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB expresados en bytes
  },
  fileFilter
});