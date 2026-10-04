import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('El formato del email es inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .trim(),
  role: z
    .enum(['CLIENT', 'DRIVER', 'ADMIN'], {
      errorMap: () => ({ message: 'El rol debe ser CLIENT, DRIVER o ADMIN' }),
    })
    .default('CLIENT'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('El formato del email es inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, 'La contraseña no puede estar vacía'),
});