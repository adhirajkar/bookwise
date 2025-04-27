
import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
const router = express.Router()

const generateToken = (userId) => jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})


router.post('/register', async (req,res)=>{
    const {email ,username, password} = req.body;
    try {
        if (!email | !username | !password){
            return res.status(400).json({message:'All fields are required'})
        }
        if(password.length<6){
            return res.status(400).json({message:'Password must be longer than 6'})
        }
        if(username.length<3){
            return res.status(400).json({message:'Username must be longer than 3'})
        }
        const emailExist = await User.findOne({email})
        if(emailExist) return res.status(400).json({message:'Email already in use'})

        const usernameExist = await User.findOne({username})
        if(usernameExist) return res.status(400).json({message:'Username already in use'})

        const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${username}`

        const user = await User.create({email, username, password, profileImage})
        const token = generateToken(user._id);
        res.status(201).json({token, user:{
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server error'})
    }
})

router.post('/login', async (req,res)=>{
    try {
        const {email ,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message:'All fields are required'})
        }
        const user = await User.findOne({email})
        if (!user) return res.status(400).json({message:'Invalid credentials'})
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) return res.status(400).json({message:'Invalid credentials'})
        const token = generateToken(user._id);
        res.status(200).json({token, user:{
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server error'})
    }
})


export default router;