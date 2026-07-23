import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';
import fs from 'fs';

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    const { folder = '/' } = req.body;
    const file = req.file;
    const userId = req.user.id;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileData = await prisma.file.create({
      data: {
        name: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype,
        folder,
        userId
      }
    });

    res.status(201).json(fileData);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
};

export const getFiles = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { folder = '/' } = req.query;

  const files = await prisma.file.findMany({
    where: { userId, folder: folder as string }
  });

  res.json(files);
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const file = await prisma.file.findFirst({ where: { id, userId } });
  if (!file) return res.status(404).json({ message: 'File not found' });

  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  await prisma.file.delete({ where: { id } });
  res.status(204).send();
};

export const renameFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  const file = await prisma.file.findFirst({ where: { id, userId } });
  if (!file) return res.status(404).json({ message: 'File not found' });

  const updated = await prisma.file.update({
    where: { id },
    data: { name }
  });

  res.json(updated);
};

export const downloadFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const file = await prisma.file.findFirst({ where: { id, userId } });
  if (!file) return res.status(404).json({ message: 'File not found' });

  if (!fs.existsSync(file.path)) {
    return res.status(404).json({ message: 'File not found on disk' });
  }

  res.download(file.path, file.name);
};
