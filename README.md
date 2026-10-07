# EcoFlex - Backend API

API REST para la plataforma logística y de traslados **EcoFlex**, construida sobre Node.js, Express y PostgreSQL con Prisma ORM.

---

## 🚀 Arquitectura y Tecnologías

- **Runtime:** Node.js (v20+ con ES Modules nativos)
- **Framework:** Express.js
- **Base de Datos & ORM:** PostgreSQL 16 + Prisma ORM
- **Seguridad & Auth:**
  - Hashing de contraseñas con `bcrypt`
  - Tokens firmados con `jsonwebtoken` (JWT) persistidos en cookies `HttpOnly`
  - Control de acceso basado en roles (RBAC: Cliente, Chofer, Admin)
  - Cabeceras de seguridad con `helmet` y limitación de tasa con `express-rate-limit`
- **Testing:** Jest + Supertest (con aislamiento en base de datos de test)
- **Contenedores:** Docker y Docker Compose
- **Integración y Entrega Continua (CI/CD):**
  - GitHub Actions: validación automática de migraciones y suite de pruebas
  - Publicación automatizada de imágenes en GitHub Container Registry (GHCR)

---

## 📁 Estructura del Proyecto

```text
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline de CI/CD (Test + Build + Push a GHCR)
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Historial de migraciones SQL
│   │   └── schema.prisma        # Modelo de datos y esquemas de Prisma
│   ├── src/
│   │   ├── config/              # Configuraciones de DB, variables y JWT
│   │   ├── controllers/         # Controladores de peticiones HTTP
│   │   ├── middlewares/         # Autenticación, validación de roles y errores
│   │   ├── routes/              # Definición de rutas del servidor
│   │   ├── services/            # Lógica de negocio desacoplada
│   │   └── app.js               # Instancia de Express configurada
│   ├── tests/                   # Suite de pruebas de integración (Jest)
│   ├── Dockerfile               # Imagen base para entorno de desarrollo local
│   ├── Dockerfile.prod          # Imagen multi-stage optimizada para producción
│   └── package.json
├── docker-compose.yml           # Orquestación local de base de datos y backend
└── README.md

🛠️ Requisitos Previos

--Node.js v20 o superior
--Docker Desktop en ejecución

⚙️ Puesta en Marcha Local
1. Clonar el repositorio y configurar variables de entorno
Crea un archivo .env dentro de la carpeta backend/ tomando como referencia:

Fragmento de código
    PORT=3000
    NODE_ENV=development
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecoflex_db?schema=public"
    JWT_SECRET="clave_secreta_jwt_para_desarrollo"

2. Levantar los servicios con Docker Compose
Desde la raíz del proyecto:
    Bashdocker-compose up -d 
    
3. Instalar dependencias y correr migraciones

    cd backend
    npm install
    npx prisma migrate dev
    
4. Iniciar el servidor en modo desarrollo

npm run dev
    El servidor quedará escuchando en http://localhost:3000.

🧪 Ejecución de TestsPara correr la suite de pruebas automatizadas:

cd backend
npm test

📦 Despliegue de Producción (Contenedor GHCR)

Las imágenes de producción son generadas automáticamente por el pipeline de GitHub Actions tras cada fusión exitosa a la rama main.

Para ejecutar la última versión productiva de forma aislada:

docker pull ghcr.io/luciano-gil/eco-flex/backend:latest
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="tu_cadena_de_conexion_a_db" \
  -e JWT_SECRET="tu_secreto_de_produccion" \
  ghcr.io/luciano-gil/eco-flex/backend:latest

📋 Endpoints Disponibles (Módulo Auth)

- **`POST /api/auth/register`**  
  Registro de nuevos usuarios en el sistema (`cliente` o `chofer`). Acceso público.

- **`POST /api/auth/login`**  
  Inicio de sesión con validación de credenciales y asignación de token JWT en cookie `HttpOnly`. Acceso público.

- **`POST /api/auth/logout`**  
  Cierre de sesión seguro y eliminación de la cookie de autenticación. Requiere autenticación.
  
- **`GET /api/auth/me`**  
  Consulta y retorno del perfil del usuario actualmente autenticado mediante el token. Requiere autenticación.
