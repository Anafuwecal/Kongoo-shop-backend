import Order from '../model/orderModel.js';
import Product from '../model/productModel.js';

export const confirmOrder = async (req, res) => {
    try {
        const { items } = req.body; 
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (let item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({ message: `Product not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.productName}. Only ${product.quantity} left.` });
            }

            totalAmount += (product.price * item.quantity);
            orderItems.push({ 
                productId: product._id, 
                quantity: item.quantity, 
                price: product.price 
            });

            //Deduct from available stock, add to purchased (sold) count
            product.quantity -= item.quantity;
            product.sold += item.quantity;
            await product.save();
        }

        //Create the final order
        const order = await Order.create({
            userId: req.user.id, // The consumer buying
            items: orderItems,
            totalAmount
        });

        return res.status(201).json({ message: 'Order confirmed successfully', order });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};