/**
 * SERVICIO DE AUTENTICACIÓN Y GESTIÓN DE USUARIOS (auth.service.js)
 * Capa de Lógica de Negocio y Persistencia.
 * Responsabilidad:
 *  - Ejecutar operaciones directas sobre la base de datos a través de Prisma
 *  - hashing con Bcrypt
 *  - Firmar y estructurar los tokens de sesión JWT
 *  - Aplicar reglas del negocio (evitar registros duplicados, verificar credenciales)
 *  - No interactúa con HTTP (desacoplado de req, res, cookies o headers)
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { jwtConfig } from '../config/jwt.config.js';

// Rondas de salting para bcrypt (complejidad del hasheo)
const SALT_ROUNDS = 10;

// SERVICIO: REGISTRO DE USUARIO
// - Comprobar si el email ya existe en la base de datos
// - Hashear la contraseña con bcrypt
// - Guardar el nuevo usuario en PostgreSQL usando Prisma
// - Generar el token JWT para que el usuario inicie sesión al instante
export const registerUser = async ({ email, password, role, name, phone }) => {
  // Busca si ya hay alguien registrado con ese email
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  // Si existe, corta ejecución lanzando un error con código 409 (Conflicto)
  if (existingUser) {
    const error = new Error('El correo electrónico ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  // Hashear la contraseña antes de guardarla en la base de datos
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Guardar el usuario en PostgreSQL
  // Usamr 'select' para que Prisma devuelva solo los campos seguros (sin la contraseña)
  const newUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      role,
      name: name || null,
      phone: phone || null
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true
    }
  });

  // Crear el token JWT con el id del usuario y su rol
  const token = jwt.sign(
    { userId: newUser.id, role: newUser.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  // Devolver el usuario creado y el token al controlador
  return { user: newUser, token };
};

// SERVICIO: LOGIN DE USUARIO

// - Busca al usuario por su email
// - Verifica si la contraseña que escribió coincide con el hash guardado
// - Genera el token JWT de sesión
export const loginUser = async ({ email, password }) => {
  // Busca al usuario en la base de datos por email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Si no existe, lanza error 401 (Credenciales inválidas)
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Comparar la contraseña en texto plano contra el hash guardado
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // Si no coincide, lanza el mismo error 401 por seguridad
  if (!isPasswordValid) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Como las credenciales son válidas, genera el token JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  // Develve los datos del usuario (sin password) y el token
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    token
  };
};

//  SERVICIO: PERFIL DE USUARIO
// Esta función busca en la base de datos los datos del usuario según su ID
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      phone: true,
      createdAt: true
    }
  });

  // Si no se encuentra el usuario, lanza error 404
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};