import express from 'express';
import { singup, login } from '../controllers/authController.js';
const router = express.Router();

router.post('/singup',singup)
router.post('/login',login)
export default router;