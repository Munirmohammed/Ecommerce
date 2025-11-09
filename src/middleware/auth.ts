import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { verifyToken } from '@/utils/jwt';
import { sendError } from '@/utils/response';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', ['Authorization header missing'], 401);
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 'Invalid token', [(error as Error).message], 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', ['User not authenticated'], 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden', ['Insufficient permissions'], 403);
      return;
    }

    next();
  };
};
