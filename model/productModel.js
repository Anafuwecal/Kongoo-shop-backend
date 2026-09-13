import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true }, 
    productImage: { type: String }, 
    quantity: { type: Number, required: true }, 
    sold: { type: Number, default: 0 }, 
    status: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }
}, {
    timestamps: true,
});

const productModel = mongoose.model('Product', productSchema);
export default productModel;