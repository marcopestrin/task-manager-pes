import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid task Id' });
  }
  
  const { name, description, status, assignedUserId } = req.body;
  if (!name || !status) {
    return res.status(400).json({ error: 'Missing required fields: name or status' });
  }

  try {

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        name,
        description: description || null,
        status,
        assignedUserId: assignedUserId || null,
      },
    });

    return res.status(200).json(updatedTask);

  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
