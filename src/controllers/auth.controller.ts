import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { sendSuccess, sendError } from '@/utils/response';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.register(req.body);
      sendSuccess(res, 'User registered successfully', user, 201);
    } catch (error) {
      const err = error as Error;
      // handle specific errors with appropriate status codes
      if (err.message.includes('already')) {
        sendError(res, err.message, [err.message], 400);
        return;
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, 'Login successful', result, 200);
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Invalid credentials') {
        sendError(res, err.message, [err.message], 401);
        return;
      }
      next(error);
    }
  }
}
