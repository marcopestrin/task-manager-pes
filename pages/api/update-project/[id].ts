import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const parsed = cookie.parse(cookies);
  const token = parsed.token;
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { name, description, userIds } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid name' });
    }
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: 'Invalid user list' });
    }

    // Verify that the project exists and is owned by the authenticated user
    const project = await prisma.project.findUnique({
      where: { id: id as string }
    });

    if (!project || project.ownerId !== decoded.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.project.update({
      where: { id: id as string },
      data: {
        name,
        description,
      },
    });
    
    // Clean up old ProjectUser links
    await prisma.projectUser.deleteMany({
      where: { projectId: id as string },
    });
    
    // Insert new ProjectUser links
    if (userIds.length > 0) {
      await prisma.projectUser.createMany({
        data: userIds.map(userId => ({
          projectId: id as string,
          userId,
        })),
      });
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        name: true,
        description: true,
        projectCode: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              }
            }
          }
        }
      }
    });

    res.status(200).json({ updatedProject });
    
  } catch (err) {
    console.error('[UPDATE PROJECT ERROR]', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
