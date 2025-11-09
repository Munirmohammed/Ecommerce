import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { ProductService } from '@/services/product.service';
import { sendSuccess, sendError, sendPaginated } from '@/utils/response';
import { uploadImage } from '@/utils/cloudinary';

const productService = new ProductService();

export class ProductController {
  async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let imageUrl: string | undefined;

      // if image file is uploaded, upload to cloudinary first
      if (req.file) {
        const result = await uploadImage(req.file);
        imageUrl = result.secure_url;
      }

      // parse form data - multer puts text fields in req.body
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock, 10),
        category: req.body.category,
        imageUrl,
      };

      const product = await productService.createProduct(productData);
      sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let imageUrl: string | undefined;

      // if new image file is uploaded, upload to cloudinary
      if (req.file) {
        const result = await uploadImage(req.file);
        imageUrl = result.secure_url;
      }

      // parse form data
      const productData: {
        name?: string;
        description?: string;
        price?: number;
        stock?: number;
        category?: string;
        imageUrl?: string;
      } = {};

      if (req.body.name) productData.name = req.body.name;
      if (req.body.description) productData.description = req.body.description;
      if (req.body.price) productData.price = parseFloat(req.body.price);
      if (req.body.stock) productData.stock = parseInt(req.body.stock, 10);
      if (req.body.category) productData.category = req.body.category;
      if (imageUrl) productData.imageUrl = imageUrl;

      const product = await productService.updateProduct(req.params.id, productData);
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
