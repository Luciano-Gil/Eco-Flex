import request from 'supertest';// importa elmodulo request de supertest para realizar solicitudes HTTP a la aplicación
import app from '../src/app.js';// importa la aplicación Express desde el archivo app.js
import { prisma } from '../src/config/prisma.js';// importa la instancia de Prisma para interactuar con la base de datos

describe('Auth Endpoints (/api/auth)', () => {
    // esta funcion lo que hace es crear un objeto testUser con datos de prueba para un usuario, incluyendo email, password, role, name y phone.
  const testUser = {
    email: `test_${Date.now()}@ecoflex.com`,// date.now() se utiliza para generar un valor único basado en la fecha y hora actual, asegurando que cada prueba tenga un correo electrónico único.
    password: 'PasswordSeguro123!',
    role: 'DRIVER',
    name: 'Usuario Test',
    phone: '1199887766'
  };

  let authToken = '';// variable para almacenar el token de autenticación generado después del login exitoso

  // Limpieza al finalizar la suite
  afterAll(async () => {
    // esta funcion lo que hace es eliminar todos los usuarios de prueba creados durante las pruebas, buscando aquellos cuyo correo electrónico 
    // contenga 'test_' y luego desconectando la instancia de Prisma, para liberar recursos y cerrar la conexión con la base de datos
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_' } }
    });
    await prisma.$disconnect();
  });

  // 1. Test de Registro
  it('POST /api/auth/register - Debería registrar un nuevo usuario y devolver 201', async () => {
     // el it es un bloque de prueba que describe el comportamiento esperado de la ruta de registro. 
     // Dentro de este bloque, se realiza una solicitud POST a la ruta /api/auth/register enviando los datos del usuario de prueba.
     // Luego, se verifican las respuestas esperadas, como el código de estado 201, la presencia de un token en la respuesta y que 
     // el objeto user devuelto contenga el correo electrónico correcto y no incluya la contraseña
    const res = await request(app)// aca recibe de parametro la aplicacion express y hace una solicitud POST a la ruta /api/auth/register 
    //enviando los datos del usuario de prueba
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).not.toHaveProperty('password');
  });

  // 2. Test de Login
  it('POST /api/auth/login - Debería autenticar al usuario y devolver 200 con token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  // 3. Test de Profile protegido
  it('GET /api/auth/profile - Debería acceder a la ruta protegida con token válido y devolver 200', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  // 4. Test de Profile sin token (Caso de error)
  it('GET /api/auth/profile - Debería rechazar el acceso sin token devolviendo 401', async () => {
    const res = await request(app)
      .get('/api/auth/profile');

    expect(res.status).toBe(401);
  });

  // 5. Test de Logout
  it('POST /api/auth/logout - Debería responder 200 confirmando el cierre de sesión', async () => {
  const res = await request(app).post('/api/auth/logout');
  expect(res.status).toBe(200);
  expect(res.body.message).toBe('Sesión cerrada exitosamente');
});
// --- Tests de Control de Acceso por Roles  ---

  it('GET /api/auth/driver-dashboard - Debería permitir acceso al DRIVER con 200', async () => {
    // authToken ya corresponde al DRIVER  registrado al inicio
    const res = await request(app)
      .get('/api/auth/driver-dashboard')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Bienvenido al panel de Transportista');
  });

  it('GET /api/auth/driver-dashboard - Debería responder 403 si un CLIENT intenta entrar', async () => {
    // Registro de  un CLIENT temporal
    const clientRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `cliente_${Date.now()}@ecoflex.com`,
        password: 'PasswordSeguro123!',
        role: 'CLIENT',
        name: 'Cliente Test'
      });

    const clientToken = clientRes.body.token;

    const res = await request(app)
      .get('/api/auth/driver-dashboard')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Acceso denegado');
  });

  it('GET /api/auth/admin-dashboard - Debería permitir acceso al ADMIN con 200', async () => {
    // Registro de  un ADMIN temporal
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `admin_${Date.now()}@ecoflex.com`,
        password: 'PasswordSeguro123!',
        role: 'ADMIN',
        name: 'Admin Test'
      });

    const adminToken = adminRes.body.token;

    const res = await request(app)
      .get('/api/auth/admin-dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Bienvenido al panel de Administrador');
  });
  // test de validacion de datos de registro:
  it('POST /api/auth/register - Debería rechazar con 400 si la contraseña no cumple requisitos mínimos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `debil_${Date.now()}@ecoflex.com`,
        password: 'corta',
        name: 'Usuario Débil',
        role: 'CLIENT',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación en los datos enviados');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('POST /api/auth/register - Debería rechazar con 400 si se envía un rol inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `hacker_${Date.now()}@ecoflex.com`,
        password: 'PasswordSeguro123!',
        name: 'Hacker Rol',
        role: 'SUPER_HACKER',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Error de validación en los datos enviados');
  });
});

