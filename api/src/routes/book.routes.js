import express from 'express'
import cloudinary from '../lib/cloudinary.js'
import { protectRoutes } from '../middleware/auth.middleware.js';
import Book from '../models/book.model.js';
const router = express.Router()

router.post('/', protectRoutes, async (req, res)=>{
    try {
        const {title, caption, rating, image} = req.body;
        if(!title || !caption || !rating || !image) {
            return res.status(400).json({message: "All fields are required"});
        }
        const uploadRes = await cloudinary.uploader.upload(image);
        const newBook = await Book.create({
            title,
            caption,
            rating,
            image: uploadRes.secure_url,
            user: req.user._id,
        });
        res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
})

router.get('/', protectRoutes, async (req,res)=>{
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        const books = await Book.find().sort({createdAt: -1}).skip(skip).limit(limit).populate('user', 'username profileImage');
        res.status(200).json({
            books,
            currentPage: page,
            totalPages: Math.ceil(books.length / limit),
            totalBooks: books.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
})

router.get('/user', protectRoutes, async (req,res)=>{
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1})
        res.status(200).json(books);
    }catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
})

router.delete('/:id', protectRoutes, async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id);
        if(!book) {
            return res.status(404).json({message: "Book not found"});
        }
        if(book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Unauthorized"});
        }
        if(book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }catch(extraError) {
                console.error(extraError);
            }
        }
        await book.deleteOne();
        res.status(200).json({message: "Book deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
})

export default router
