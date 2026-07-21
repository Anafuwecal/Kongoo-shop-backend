import Product from '../model/productModel.js';

export const createProduct = async (req, res) => {
    try {
        const { productName, description, price, productImage, quantity } = req.body;
        if (!productName || !price || !quantity) {
            return res.status(400).json({ message: 'productName, price, and quantity are required' });
        }
        const product = await Product.create({
            productName,
            description,
            price,
            productImage,
            quantity,
            userId: req.user.id 
        });
        return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('userId', 'name email');
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
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