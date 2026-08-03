# Eco-Flex - Backend & Infrastructure

Entorno de desarrollo local para el proyecto **eco-flex**. La arquitectura utiliza contenedores Docker para aislar la base de datos (PostgreSQL) y el servidor backend (Node.js), garantizando que todo funcione de la misma manera sin importar el sistema operativo local

---

## 📂 Estructura del Proyecto

La disposición de los archivos y carpetas clave en la raíz del espacio de trabajo se organiza de la siguiente manera:

eco-flex/
├── docker-compose.yml       # Orquestador de servicios (Base de datos y Backend)
└── backend/                 # Código fuente y entorno del servidor de aplicaciones
    ├── Dockerfile           # Receta de Docker para construir la imagen de Node.js
    ├── package.json         # Manifiesto de dependencias y scripts de NPM
    └── index.js             # Punto de entrada principal de la aplicación

    