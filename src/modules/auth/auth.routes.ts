import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post("/login", AuthController.loginWithEmailAndPassword)
router.get("/google", AuthController.loginWithGoogle)
router.post("/forgot-password", AuthController.forgotPassword)
router.post("/reset-password", AuthController.resetPassword)

export const authRouter = router

