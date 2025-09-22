import express, { json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
const app = express()
import authRoutes from './routes/authRoutes.js'
import connectDB from './db/db.js'
import dotenv from 'dotenv'
dotenv.config()

app.use(json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(morgan('dev'))
app.use('/api',authRoutes)

app.listen(3000,()=>{
    console.log("serer is running on port 3000");
    console.log(process.env.JWT_SECRET);
    connectDB()
})