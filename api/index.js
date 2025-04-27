import express from 'express'
import 'dotenv/config'
import { connectDB } from './src/lib/db.js'
import authRoutes from './src/routes/auth.routes.js'
import bookRoutes from './src/routes/book.routes.js' 
import cors from 'cors'
import morgan from 'morgan'
const app = express()
app.use(express.json())
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(5000,()=>{
    connectDB();
    console.log('Server on port 5000');
})