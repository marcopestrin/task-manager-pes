import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { projectId } = req.query;
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid projectId' });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedUser: {
          include: {
            account: true, // in this way i can get also the real name of user
          },
        },
      },
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
