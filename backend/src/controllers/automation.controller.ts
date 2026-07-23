import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../index';
import { createLog } from './log.controller';

export const createAutomation = async (req: AuthRequest, res: Response) => {
  const { name, flow, schedule } = req.body;
  const userId = req.user.id;

  const automation = await prisma.automation.create({
    data: { name, flow: JSON.stringify(flow), schedule, userId }
  });

  await createLog(userId, 'AUTOMATION_CREATED', `Created automation: ${name}`);

  res.status(201).json(automation);
};

export const getAutomations = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const automations = await prisma.automation.findMany({
    where: { userId },
    include: { logs: true }
  });

  const parsed = automations.map(a => ({
    ...a,
    flow: JSON.parse(a.flow)
  }));

  res.json(parsed);
};

export const updateAutomation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, flow, schedule, status } = req.body;
  const userId = req.user.id;

  const automation = await prisma.automation.findFirst({
    where: { id, userId }
  });

  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }

  const updated = await prisma.automation.update({
    where: { id },
    data: {
      name,
      flow: flow ? JSON.stringify(flow) : undefined,
      schedule,
      status
    }
  });

  await createLog(userId, 'AUTOMATION_UPDATED', `Updated automation: ${name}`);

  res.json(updated);
};

export const deleteAutomation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const automation = await prisma.automation.findFirst({
    where: { id, userId }
  });

  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }

  await prisma.automation.delete({ where: { id } });
  await createLog(userId, 'AUTOMATION_DELETED', `Deleted automation: ${automation.name}`);

  res.status(204).send();
};

export const runAutomation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const automation = await prisma.automation.findFirst({
    where: { id, userId }
  });

  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }

  const log = await prisma.automationLog.create({
    data: {
      automationId: id,
      status: 'RUNNING',
      message: 'Started execution'
    }
  });

  setTimeout(async () => {
    await prisma.automationLog.update({
      where: { id: log.id },
      data: {
        status: 'SUCCESS',
        message: 'Execution completed',
        details: 'All steps executed successfully'
      }
    });

    await createLog(userId, 'AUTOMATION_RUN', `Automation ${automation.name} completed`);
  }, 2000);

  res.json({ message: 'Automation started', logId: log.id });
};
