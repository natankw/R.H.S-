import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import deviceRoutes from './routes/device.routes';
import groupRoutes from './routes/group.routes';
import proxyRoutes from './routes/proxy.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3333;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/proxies', proxyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
