import express from 'express';
import * as productController from '../controllers/productController';
import { verifyToken } from '../utils/tokenManager';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

export default router; 