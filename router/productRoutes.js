import express from 'express';
import { 
    createProduct, getAllProducts, getProductById, 
    updateProduct, deleteProduct, getMerchantProducts 
} from '../controller/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();    

// Public Routes 
router.get('/', getAllProducts);        
router.get('/:id', getProductById);     

// Protected Routes 
router.get('/merchant/my-products', protect, getMerchantProducts); 
router.post('/create', protect, upload.single('productImage'), createProduct); 
router.put('/update/:id', protect, updateProduct);
router.delete('/delete/:id', protect, deleteProduct);

export default router;