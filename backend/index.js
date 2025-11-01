import express, { json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
const app = express()
import authRoutes from './routes/authRoutes.js'
import donorRoutes from './routes/donorRoutes.js'
import connectDB from './db/db.js'
import dotenv from 'dotenv'
dotenv.config()

app.use(json())
app.use(cors({
  origin:   process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
console.log("Frontend url", process.env.CLIENT_URL)
app.use(morgan('dev'))
app.use('/api',authRoutes)
app.use('/api',donorRoutes)

app.listen(3000,()=>{
    console.log("serer is running on port 3000");
    connectDB()
})