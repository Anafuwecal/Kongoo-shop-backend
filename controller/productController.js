import Product from '../model/productModel.js';

export const createProduct = async (req, res) => {
    try {
        const { productName, description, price, quantity, category } = req.body;
        if (!productName || !price || !quantity || !category) {
            return res.status(400).json({ message: 'productName, price, quantity, and category are required' });
        }
        
        const productImage = req.file ? req.file.path : ''; 

        const product = await Product.create({
            productName, description, price, productImage, quantity, category, userId: req.user.id 
        });
        return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMerchantProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
        
        const insights = products.map(product => ({
            _id: product._id,
            productName: product.productName,
            image: product.productImage,
            price: product.price,
            remainingStock: product.quantity, 
            purchased: product.sold,          
            totalRevenue: product.price * product.sold 
        }));

        return res.status(200).json({ message: 'Merchant dashboard retrieved', data: insights });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.productName = { $regex: search, $options: 'i' }; 
        }
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .populate('userId', 'name') 
            .sort({ createdAt: -1 }); 

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('userId', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        return res.status(200).json({
            product,
            availability: product.quantity > 0 ? 'In Stock' : 'Out of Stock',
            remaining: product.quantity
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to update this product' });
        }
        const { productName, description, price, productImage, quantity } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { productName, description, price, productImage, quantity },
            { new: true, runValidators: true }
        );
        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this product' });
        }
        await product.deleteOne(); 
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};