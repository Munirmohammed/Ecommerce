import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { ProductService } from '@/services/product.service';
import { sendSuccess, sendError, sendPaginated } from '@/utils/response';

const productService = new ProductService();

export class ProductController {
  async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      sendSuccess(res, 'Product updated successfully', product, 200);
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Product not found') {
        sendError(res, err.message, [err.message], 404);
        return;
      }
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await productService.getProducts({ page, limit, search });

      sendPaginated(
        res,
        'Products retrieved successfully',
        result.products,
        result.page,
        result.limit,
        result.total
      );
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getProductById(req.params.id);
      sendSuccess(res, 'Product retrieved successfully', product, 200);
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Product not found') {
        sendError(res, err.message, [err.message], 404);
        return;
      }
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.deleteProduct(req.params.id);
      sendSuccess(res, result.message, null, 200);
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Product not found') {
        sendError(res, err.message, [err.message], 404);
        return;
      }
      next(error);
    }
  }
}
