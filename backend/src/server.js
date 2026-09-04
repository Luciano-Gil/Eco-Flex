import app from './app.js';// se importa la instancia de Express desde app.js

const PORT = process.env.PORT || 3000; // Se define el puerto en el que se ejecutará el servidor, usando la variable de entorno PORT si está definida, o 3000 como valor por defecto.

// Inicia el servidor y escucha en el puerto especificado
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});