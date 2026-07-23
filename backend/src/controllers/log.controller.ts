import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';

export const getLogs = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { limit = 100, offset = 0 } = req.query;

  const logs = await prisma.log.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    skip: Number(offset)
  });

  const total = await prisma.log.count({ where: { userId } });

  res.json({ logs, total, limit: Number(limit), offset: Number(offset) });
};

export const createLog = async (userId: string, action: string, details?: string) => {
  await prisma.log.create({
    data: { userId, action, details }
  });
};

export const getAutomationLogs = async (req: AuthRequest, res: Response) => {
  const { automationId } = req.params;
  const userId = req.user.id;

  const automation = await prisma.automation.findFirst({
    where: { id: automationId, userId }
  });

  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }

  const logs = await prisma.automationLog.findMany({
    where: { automationId },
    orderBy: { createdAt: 'desc' }
  });

  res.json(logs);
};
