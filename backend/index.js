import express, { json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
const app = express()
import authRoutes from './routes/authRoutes.js'
import connectDB from './db/db.js'

app.use(json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api',authRoutes)

app.listen(3000,()=>{
    console.log("serer is running on port 3000");
    connectDB()
})