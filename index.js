import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configuration/database.js';
import userRoutes from './router/userRoutes.js';
import productRoutes from './router/productRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/api', userRoutes);
app.use('/api', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});