import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, userId } = req.body;

  try {

    const project = await prisma.project.findUnique({
      where: { projectCode: code },
      include: {
        users: {
          where: { userId },
        },
      },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.users.length > 0) {
      return res.status(400).json({ error: 'Already a participant' });
    }

    await prisma.projectUser.create({
      data: {
        projectId: project.id,
        userId,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
