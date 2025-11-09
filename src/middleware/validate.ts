import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { sendError } from '@/utils/response';

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
        sendError(res, 'Validation failed', errors, 400);
        return;
      }
      next(error);
    }
  };
};
