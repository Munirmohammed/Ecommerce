import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { upload } from '@/middleware/upload';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
  getProductsSchema,
} from '@/validators/product.validator';

const router = Router();
const productController = new ProductController();

// public routes
router.get('/', validate(getProductsSchema), productController.getProducts);
router.get('/:id', validate(getProductSchema), productController.getProductById);

// admin only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createProductSchema),
  productController.createProduct
);

router.post(
  '/upload',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  productController.uploadProductImage
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(deleteProductSchema),
  productController.deleteProduct
);

export default router;
