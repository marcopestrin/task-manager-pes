import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description, status, projectId, assignedUserId } = req.body;

  if (!name || !status || !projectId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        name,
        description: description || null,
        status,
        project: {
          connect: { id: projectId },
        },
        assignedUser: assignedUserId
          ? { connect: { id: assignedUserId } }
          : undefined,
      }
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
