import bcrypt from 'bcrypt'; // para el hashing de contraseñas
import jwt from 'jsonwebtoken'; // para la generación y verificación de tokens JWT
import { prisma } from '../../config/prisma.js'; //  ruta a la instancia de Prisma
import { jwtConfig } from '../../config/jwt.config.js'; // importación de la configuración de JWT desde el archivo jwt.config.js

// 1. registrarse
export const register = async (req, res) => {
  try {
    const { email, password, role, name, phone } = req.body;
    // se obtiene del cuerpo de la solicitud campos email, password, role, name y phone,
    // necesarios para crear un nuevo usuario en la base de datos. Se espera que el cliente envíe estos datos en formato JSON al endpoint de registro

    if (!email || !password || !role) {
      return res.status(400).json({ 
        message: 'Email, Contraseña y Rol son obligatorios' 
      });
    }

    // Verifica  si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'El correo electrónico ya está registrado' 
      });
    }

    // Hashear la contraseña con salt rounds, los rounds eran la 10 son las veces que se aplica el algoritmo de hashing para 
    // aumentar la seguridad. A mayor número de rounds, más seguro pero más lento será el proceso de hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // las funciones await se utilizan para esperar a que las operaciones asincrónicas de hashing y búsqueda en la base de datos 
    // se completen antes de continuar con el flujo del código.asegura q los datos estén listos antes de proceder a la siguiente operación, 
    // evitando errores y garantizando la integridad de los datos

    // Guardar en la base de datos
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
      //esta funcion usa await para esperar a que la operación de creación del usuario en la base de datos se complete antes de continuar y una 
      // vez creado devuelve un objeto con los campos id, email, role, name y createdAt del nuevo usuario creado. y otro objeto ´select´ donde 
      // se especifica qué campos del usuario recién creado se desean devolver en la respuesta, evitando exponer la contraseña
    });

    // Generar  token JWT de sesión inmediata
    const token = jwt.sign( 
      { userId: newUser.id, role: newUser.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 2. LOGIN
export const login = async (req, res) => {
  try {
    // obtengo del body de la solicitud los campos email y password
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña requeridos' 
      });
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseña con Bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 3. PERFIL DEL USUARIO AUTENTICADO
export const profile = async (req, res) => {
  try {
    // req.user proviene del middleware que verifica el token, es decir que el middleware de autenticación JWT debe haber agregado la información del
    //  usuario al objeto req antes de que esta función se ejecute.
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user }); // este user en corchetes referencia al objeto user q se encuentra en el archivo de la base de datos
    //  y que se obtuvo con prisma.user.findUnique, no al req.user q viene del middleware
  } catch (error) {
    console.error('Error en profile:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

};

// 4 LOGOUT

export const logout = async (req, res) => {
  return res.status(200).json({
    message: 'Sesión cerrada exitosamente'
  });
};