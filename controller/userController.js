import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'your_temporary_secret_key';
    return jwt.sign({ id }, secret, { expiresIn: '1d' });
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { password: _, ...safeUser } = user.toObject();
        const token = generateToken(user._id);
        return res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: safeUser 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, storeName } = req.body;
        if (!name || !email || !password || !storeName) {
            return res.status(400).json({ message: 'name, email, and password are required' });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            storeName,
        });
        const { password: _, ...safeUser } = user.toObject();
        const token = generateToken(user._id);
        return res.status(201).json({ 
            message: 'User registered successfully', 
            token,
            user: safeUser 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};