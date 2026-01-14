import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';


const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/tickets', ticketRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});