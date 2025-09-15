import express from 'express';
import { forgotPassword, resetPassword, signup, login } from '../controllers/authController.js';
const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post('/signup',signup)
router.post('/login',login)
export default router;