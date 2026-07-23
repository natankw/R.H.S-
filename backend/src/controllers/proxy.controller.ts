import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';

export const createProxy = async (req: AuthRequest, res: Response) => {
  const { host, port, protocol, username, password } = req.body;
  const userId = req.user.id;

  const proxy = await prisma.proxy.create({
    data: { host, port: Number(port), protocol, username, password, userId }
  });
  res.status(201).json(proxy);
};

export const getProxies = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const proxies = await prisma.proxy.findMany({
    where: { userId },
    include: { devices: true }
  });
  res.json(proxies);
};

export const updateProxy = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const userId = req.user.id;

  const proxy = await prisma.proxy.findFirst({ where: { id, userId } });
  if (!proxy) return res.status(404).json({ message: 'Proxy not found' });

  const updated = await prisma.proxy.update({
    where: { id },
    data
  });
  res.json(updated);
};

export const deleteProxy = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const proxy = await prisma.proxy.findFirst({ where: { id, userId } });
  if (!proxy) return res.status(404).json({ message: 'Proxy not found' });

  await prisma.proxy.delete({ where: { id } });
  res.status(204).send();
};
