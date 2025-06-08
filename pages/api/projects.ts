import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLitProjectsByUserId = async (userId) => {
  let projects = await prisma.project.findMany({
    where: {
      OR: [ 
        { ownerId: userId },
        {
          users: {
            some: {
              userId, //shared visibility
            },
          },
        },
      ],
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      projectCode: true,
      ownerId: true,
      tasks: {
        select: {
          name: true, // mi interessa sapere solo il nome del task
        },
      },
      users: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      owner: {
        select: {
          username: true,
        },
      },
    },
  });
  return projects.map(project => ({
    ...project,
    accessType: project.ownerId === userId ? 'owner' : 'participant',
  }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = parse(req.headers.cookie || '').token;
  if (!token) {
    return res.status(401).json({ message: 'Token not found in cookies' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
  const userId = (decoded as any).userId;

  try {
    const projects = await getLitProjectsByUserId(userId);

    return res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
