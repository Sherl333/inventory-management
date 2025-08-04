import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getProducts,insertProduct,updateProduct,deleteProduct } from '../controllers/productControllers.js';

const router = express.Router();
router.get('/getProducts', verifyToken, getProducts);
router.post('/insertProducts', verifyToken, insertProduct);
router.put('/:id', verifyToken, updateProduct);  
router.delete('/:id', verifyToken, deleteProduct);


export default router;

