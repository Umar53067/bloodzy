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

// Configure CORS properly for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      'http://localhost:5173', // Vite default dev port
      'http://localhost:3000',
    ].filter(Boolean)
    
    // Allow if in allowed list or in development mode
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      console.log(`CORS blocked origin: ${origin}`)
      console.log('Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // Allow cookies/auth headers if needed
}

app.use(cors(corsOptions))
console.log("Frontend url", process.env.CLIENT_URL)
app.use(morgan('dev'))
app.use('/api',authRoutes)
app.use('/api',donorRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})