import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

export const validateCreateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, price, stock, category } = req.body;

  const errors: string[] = [];

  if (!name || name.trim().length < 3 || name.trim().length > 100) {
    errors.push('Name must be between 3 and 100 characters');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    errors.push('Price must be a positive number');
  }

  if (!stock || isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0) {
    errors.push('Stock must be 0 or greater');
  }

  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    sendError(res, 'Validation failed', errors, 400);
    return;
  }

  next();
};

export const validateUpdateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, price, stock, category } = req.body;

  const errors: string[] = [];

  if (name !== undefined && (name.trim().length < 3 || name.trim().length > 100)) {
    errors.push('Name must be between 3 and 100 characters');
  }

  if (description !== undefined && description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
    errors.push('Price must be a positive number');
  }

  if (stock !== undefined && (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0)) {
    errors.push('Stock must be 0 or greater');
  }

  if (category !== undefined && category.trim().length === 0) {
    errors.push('Category cannot be empty');
  }

  if (errors.length > 0) {
    sendError(res, 'Validation failed', errors, 400);
    return;
  }

  next();
};
