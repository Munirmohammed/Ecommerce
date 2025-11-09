import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '@/utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('Error:', err);

  // zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    return sendError(res, 'Validation failed', errors, 400);
  }

  // jwt errors
  if (err.name === 'JsonWebTokenError' || err.message.includes('token')) {
    return sendError(res, 'Invalid or expired token', [err.message], 401);
  }

  // prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return sendError(res, 'Database error', [err.message], 400);
  }

  // default to 500 server error
  return sendError(res, 'Internal server error', [err.message], 500);
};
