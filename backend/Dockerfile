
# Dockerfile construye la imagen aislada de Linux que ejecutará al backend Node.js. 

# RELACIONES:
# - Con docker-compose.yml: El Compose lee este archivo mediante la propiedad 
#   `context: ./backend` para saber cómo armar el contenedor del servicio 'backend'.
# - Con package.json: Este archivo depende críticamente del package.json para 
#   saber qué librerías instalar (como Express, nodemon, etc.) y qué comando 
#   ejecutar al iniciar (`npm run dev`).
# ==============================================================================

# Descarga la base oficial de Node.js en su versión ligera (Alpine Linux)
FROM node:20-alpine

# Instalar OpenSSL necesario para Prisma en Linux Alpine
RUN apk add --no-cache openssl
# Establece el directorio interno del contenedor donde se guardará y ejecutará el proyecto
WORKDIR /app

# Copia los archivos de definición de dependencias (package.json y package-lock.json) al contenedor
COPY package*.json ./

# Descarga e instala los paquetes necesarios dentro del contenedor según lo definido en package.json
RUN npm install

# coppia todo el código fuente del backend al contenedor
COPY . .

# Lanza el script de desarrollo con live-reload definido en los "scripts" del package.json
CMD ["npm", "run", "dev"]