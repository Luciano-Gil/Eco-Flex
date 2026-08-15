# 🚚 EcoFlex MVP - Roadmap de Desarrollo & Reglas de Aprendizaje

> **Proyecto:** EcoFlex (Plataforma Logística)
> **Estudiante:** Luciano Damián Gil | Universidad del Chubut (2026)
> **Enfoque:** Calidad Máxima, Seguridad Profesional y Arquitectura Escalable.

---

## ⚠️ Instrucciones para la IA Colaboradora (Reglas de Aprendizaje)

Cada vez que iniciemos un nuevo chat para trabajar en un punto de este Roadmap, la IA DEBE seguir esta estructura de enseñanza antes de entregar código:

1. **Lección Teórica Conceptual:** Explicación en español claro y accesible.
2. **Impacto en Seguridad y Calidad:** Por qué es crucial para evitar fallas o ataques.
3. **Estructura Esquelética del Código:** Mostrar primero el esquema o diagrama conceptual del código.
4. **Implementación Paso a Paso:** Código final con explicaciones detalladas para ejecutar en Windows / Docker.

---

## 🗺️ Estado del Proyecto (Checklist)

### FASE 1: Arquitectura Base, Seguridad Inicial e Integración Continua
- [ ] **1.1 Cifrado y Secretos:** Configurar `.env` / `.env.example` para resguardar credenciales.
- [ ] **1.2 Instancia Segura de Prisma:** Crear `lib/prisma.js` (Patrón Singleton para Connection Pool).
- [ ] **1.3 Middlewares de Seguridad Global:** Implementar `helmet`, `cors`, `express-rate-limit` y parseo JSON seguro.
- [ ] **1.4 Esquema Base de Prisma:** Modelar `Usuario`, `TransportistaDoc`, `Carga`, `RutaTransportista` y `Pago` en `schema.prisma`.
- [ ] **1.5 Migración Inicial:** Ejecutar la migración en PostgreSQL + PostGIS vía Docker.
- [ ] **1.6 Pipeline CI/CD:** Configurar `.github/workflows/ci.yml` para validaciones automáticas.
- [ ] 1.6 Configuración del Entorno de Tests (tests/)Instalar y configurar el framework de pruebas (ej: Jest o Vitest + Supertest).
    Crear el primer test de salud del servidor (GET /api/health).
- [ ] 1.7 Pipeline CI/CD en GitHub Actions (.github/workflows/ci.yml):Configurar el robot para que ejecute automáticamente npm test en cada push o Pull Request.  -

### FASE 2: Módulo de Usuarios, Autenticación y Control Documental
- [ ] **2.1 Hashing de Contraseñas:** Encriptación con `bcryptjs`.
- [ ] **2.2 Autenticación JWT:** Endpoints de Login y Registro (`/api/auth`).
- [ ] **2.3 Middleware de Roles:** Guardián de seguridad para `CLIENTE`, `TRANSPORTISTA` y `ADMIN`.
- [ ] **2.4 Subida Segura de Documentación:** Subida de Licencia, VTV/RTO y Póliza con validación de MIME type.
- [ ] **2.5 Panel de Auditoría Admin:** Aprobar/Rechazar documentación de choferes.

### FASE 3: Módulo de Inventario Inteligente Asistido por IA (Whisper + Gemini 1.5 Pro)
- [ ] **3.1 Recepción de Audio:** Manejo de notas de voz en memoria (`multer`).
- [ ] **3.2 Transcripción con Whisper:** Procesamiento de voz a texto.
- [ ] **3.3 Estructuración con Gemini Pro:** Prompt en modo `JSON Schema` para convertir texto en bultos.
- [ ] **3.4 Validación con Zod:** Garantizar que el JSON de la IA sea estricto y seguro.
- [ ] **3.5 Confirmación de Checklist:** Publicación definitiva de la carga por parte del dador.

### FASE 4: Motor Geoespacial y Algoritmo de Matching (PostGIS)
- [ ] **4.1 Declaración de Rutas:** Registro de trayectos de retorno del transportista.
- [ ] **4.2 Geocodificación Espacial:** Conversión de localidades a puntos geométricos en PostGIS.
- [ ] **4.3 Trazo de Ruta y Buffer 30 km:** Algoritmo en PostGIS con zona de desvío máximo de 30 km.
- [ ] **4.4 Algoritmo de Coincidencias:** Filtro de cargas en formato de lista de texto optimizada.
- [ ] **4.5 Cotización Automática:** Cálculo por $m³$ o por $km$ indexado al precio del gasoil.

### FASE 5: Pasarela Financiera, Escrow y Seguro por Valor Declarado
- [ ] **5.1 Integración Mercado Pago:** Generación de preferencias de pago en Sandbox.
- [ ] **5.2 Comisión EcoFlex (10%):** Automatización de la retención de la plataforma.
- [ ] **5.3 Seguro Opcional (1%):** Módulo de seguro por valor declarado.
- [ ] **5.4 Webhook de Pagos:** Recepción de alertas de Mercado Pago y estado `RETENIDO_ESCROW`.
- [ ] **5.5 OK Digital (Liberación):** Acreditación de fondos al chofer tras confirmación del cliente.

### FASE 6: Pruebas Integrales, Documentación y Despliegue Cloud
- [ ] **6.1 Pruebas End-to-End:** Simulación de 10 escenarios completos de envío.
- [ ] **6.2 Soporte Offline-First:** Persistencia local de datos ante zonas sin señal en ruta.
- [ ] **6.3 Despliegue Cloud:** Publicación en Railway (Backend) y Supabase Pro (DB PostGIS).
- [ ] **6.4 Documentación Swagger:** Generación de especificación interactiva OpenAPI.