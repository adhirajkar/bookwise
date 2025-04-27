import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoutes = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        req.user = user;
        next();
    }catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server error'})
    }
}