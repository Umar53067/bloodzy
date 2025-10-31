import express from 'express';
import { forgotPassword, resetPassword, signup, login, me, updateMe } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post('/signup',signup)
router.post('/login',login)
router.get('/me', protect, me)
router.put('/me', protect, updateMe)
export default router;