import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';
import { v4 as uuidv4 } from 'uuid';

const generateDeviceData = (overrides = {}) => ({
  name: `Device-${Math.floor(Math.random() * 10000)}`,
  model: 'SM-G998B',
  manufacturer: 'Samsung',
  android: '13',
  fingerprint: `samsung/${uuidv4()}`,
  androidId: uuidv4(),
  imei: `${Math.floor(Math.random() * 100000000000000)}`,
  serialNumber: `RHS${Math.floor(Math.random() * 1000000)}`,
  ram: 8,
  cpu: 'Snapdragon 888',
  storage: 256,
  resolution: '1440x3040',
  tags: [],
  status: 'OFFLINE',
  ...overrides
});

export const createDevice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const data = { ...req.body, userId };

    if (data.groupId) {
      const group = await prisma.group.findFirst({ where: { id: data.groupId, userId } });
      if (!group) return res.status(404).json({ message: 'Group not found' });
    }
    if (data.proxyId) {
      const proxy = await prisma.proxy.findFirst({ where: { id: data.proxyId, userId } });
      if (!proxy) return res.status(404).json({ message: 'Proxy not found' });
    }

    const device = await prisma.device.create({
      data: {
        ...generateDeviceData(data),
        userId
      }
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error creating device', error });
  }
};

export const getDevices = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const devices = await prisma.device.findMany({
    where: { userId },
    include: { group: true, proxy: true }
  });
  res.json(devices);
};

export const getDeviceById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const device = await prisma.device.findFirst({
    where: { id, userId },
    include: { group: true, proxy: true }
  });
  if (!device) return res.status(404).json({ message: 'Device not found' });
  res.json(device);
};

export const updateDevice = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const data = req.body;

  const device = await prisma.device.findFirst({ where: { id, userId } });
  if (!device) return res.status(404).json({ message: 'Device not found' });

  if (data.groupId) {
    const group = await prisma.group.findFirst({ where: { id: data.groupId, userId } });
    if (!group) return res.status(404).json({ message: 'Group not found' });
  }
  if (data.proxyId) {
    const proxy = await prisma.proxy.findFirst({ where: { id: data.proxyId, userId } });
    if (!proxy) return res.status(404).json({ message: 'Proxy not found' });
  }

  const updated = await prisma.device.update({
    where: { id },
    data,
    include: { group: true, proxy: true }
  });
  res.json(updated);
};

export const deleteDevice = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const device = await prisma.device.findFirst({ where: { id, userId } });
  if (!device) return res.status(404).json({ message: 'Device not found' });

  await prisma.device.delete({ where: { id } });
  res.status(204).send();
};

export const cloneDevice = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const original = await prisma.device.findFirst({ where: { id, userId } });
  if (!original) return res.status(404).json({ message: 'Device not found' });

  const { id: _, createdAt, updatedAt, lastActivity, ...cloneData } = original;
  const newDevice = await prisma.device.create({
    data: {
      ...cloneData,
      name: `${cloneData.name}-copy`,
      fingerprint: `samsung/${uuidv4()}`,
      androidId: uuidv4(),
      imei: `${Math.floor(Math.random() * 100000000000000)}`,
      serialNumber: `RHS${Math.floor(Math.random() * 1000000)}`,
      userId
    }
  });
  res.status(201).json(newDevice);
};

export const startDevice = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const device = await prisma.device.update({
    where: { id },
    data: { status: 'ONLINE', lastActivity: new Date() }
  });
  res.json({ message: 'Device started', device });
};

export const stopDevice = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const device = await prisma.device.update({
    where: { id },
    data: { status: 'OFFLINE' }
  });
  res.json({ message: 'Device stopped', device });
};
