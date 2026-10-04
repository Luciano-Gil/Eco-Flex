import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    // safeParse no arroja excepciones, devuelve un objeto { success, data, error }
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        message: 'Error de validación en los datos enviados',
        errors: formattedErrors,
      });
    }

    // Si pasó la validación, reemplaza el body con los datos sanitizados/tipados
    req.body = result.data;
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error interno en la validación de datos',
      error: error.message,
    });
  }
};