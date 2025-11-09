import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

// flexible validation that works with both JSON and form data
export const validateCreateProductFlexible = (
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

  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  if (!price || isNaN(priceNum) || priceNum <= 0) {
    errors.push('Price must be a positive number');
  }

  const stockNum = typeof stock === 'string' ? parseInt(stock, 10) : stock;
  if (stock === undefined || stock === null || isNaN(stockNum) || stockNum < 0) {
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

export const validateUpdateProductFlexible = (
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

  if (price !== undefined) {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push('Price must be a positive number');
    }
  }

  if (stock !== undefined) {
    const stockNum = typeof stock === 'string' ? parseInt(stock, 10) : stock;
    if (isNaN(stockNum) || stockNum < 0) {
      errors.push('Stock must be 0 or greater');
    }
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
