import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';
import fs from 'fs';

export const uploadApp = async (req: AuthRequest, res: Response) => {
  try {
    const { name, package: pkg, version } = req.body;
    const file = req.file;
    const userId = req.user.id;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const app = await prisma.app.create({
      data: {
        name,
        package: pkg,
        version,
        filePath: file.path,
        size: file.size,
        userId
      }
    });

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading app', error });
  }
};

export const getApps = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const apps = await prisma.app.findMany({ where: { userId } });
  res.json(apps);
};

export const deleteApp = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const app = await prisma.app.findFirst({ where: { id, userId } });
  if (!app) return res.status(404).json({ message: 'App not found' });

  if (fs.existsSync(app.filePath)) {
    fs.unlinkSync(app.filePath);
  }

  await prisma.app.delete({ where: { id } });
  res.status(204).send();
};

export const installApp = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { deviceId } = req.body;

  const app = await prisma.app.findFirst({ where: { id, userId: req.user.id } });
  if (!app) return res.status(404).json({ message: 'App not found' });

  res.json({ message: `App ${app.name} installed on device ${deviceId}` });
};

export const uninstallApp = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { deviceId } = req.body;

  res.json({ message: `App uninstalled from device ${deviceId}` });
};
