import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';

export const createGroup = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const userId = req.user.id;

  const group = await prisma.group.create({
    data: { name, userId }
  });
  res.status(201).json(group);
};

export const getGroups = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const groups = await prisma.group.findMany({
    where: { userId },
    include: { devices: true }
  });
  res.json(groups);
};

export const updateGroup = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  const group = await prisma.group.findFirst({ where: { id, userId } });
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const updated = await prisma.group.update({
    where: { id },
    data: { name }
  });
  res.json(updated);
};

export const deleteGroup = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const group = await prisma.group.findFirst({ where: { id, userId } });
  if (!group) return res.status(404).json({ message: 'Group not found' });

  await prisma.group.delete({ where: { id } });
  res.status(204).send();
};
