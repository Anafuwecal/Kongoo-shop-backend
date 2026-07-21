import express from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controller/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();    

router.get('/get', getAllProducts);
router.get('/get/:id', getProductById);
router.post('/create', protect, createProduct);
router.put('/update/:id', protect, updateProduct);
router.delete('/delete/:id', protect, deleteProduct);
export default router;