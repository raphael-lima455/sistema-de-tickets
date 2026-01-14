import express from 'express';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerUserController.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', registerUser);

export default router;