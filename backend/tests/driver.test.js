import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('POST /api/drivers/documents', () => {
  let driverToken;
  let driverId;

  // Creamos un chofer en la base para las pruebas
  beforeAll(async () => {
    await prisma.driverDoc.deleteMany();
    await prisma.user.deleteMany({ where: { email: 'chofer_test@ecoflex.com' } });

    const authRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'chofer_test@ecoflex.com',
        password: 'Password123!',
        role: 'DRIVER',
        name: 'Chofer De Prueba'
      });

    driverToken = authRes.body.token;
    driverId = authRes.body.user.id;
  });

  // Limpieza al terminar
  afterAll(async () => {
    await prisma.driverDoc.deleteMany();
    await prisma.user.deleteMany({ where: { email: 'chofer_test@ecoflex.com' } });
    await prisma.$disconnect();
  });

  test('Debe subir los 3 documentos correctamente y quedar en estado PENDING', async () => {
    const dummyPdf = Buffer.from('%PDF-1.4 dummy content');
    const dummyImg = Buffer.from('fake image binary content');

    const response = await request(app)
      .post('/api/drivers/documents')
      .set('Authorization', `Bearer ${driverToken}`)
      .field('cuit', '20-38492019-4')
      .attach('license', dummyPdf, 'licencia.pdf')
      .attach('vtv', dummyImg, 'vtv.png')
      .attach('insurance', dummyPdf, 'seguro.pdf');

    expect(response.status).toBe(201);
    expect(response.body.message).toContain('Documentación enviada correctamente');
    expect(response.body.data.status).toBe('PENDING');
    expect(response.body.data.cuit).toBe('20-38492019-4');
    expect(response.body.data.licenseUrl).toContain('/uploads/');

    // Verificamos que se guardó en PostgreSQL
    const docInDb = await prisma.driverDoc.findUnique({
      where: { driverId }
    });
    expect(docInDb).not.toBeNull();
    expect(docInDb.status).toBe('PENDING');
  });

  test('Debe rechazar con 400 si falta el CUIT', async () => {
    const dummyPdf = Buffer.from('%PDF-1.4 dummy content');

    const response = await request(app)
      .post('/api/drivers/documents')
      .set('Authorization', `Bearer ${driverToken}`)
      .attach('license', dummyPdf, 'licencia.pdf')
      .attach('vtv', dummyPdf, 'vtv.pdf')
      .attach('insurance', dummyPdf, 'seguro.pdf');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('El número de CUIT es obligatorio');
  });

  test('Debe rechazar con 401 si no se envía token de autenticación', async () => {
    const response = await request(app)
      .post('/api/drivers/documents')
      .field('cuit', '20-38492019-4');

    expect(response.status).toBe(401);
  });
});