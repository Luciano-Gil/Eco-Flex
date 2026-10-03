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
});