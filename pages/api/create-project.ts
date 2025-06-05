import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

const generateProjectCode = () => {
  // Generate a unique project code (e.g. 6 alphanumeric characters)
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { name, description } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid project name' });
    }

    let projectCode = generateProjectCode();
    // Make sure the code is unique
    let exists = await prisma.project.findUnique({ where: { projectCode } });
    while (exists) {
      projectCode = generateProjectCode();
      exists = await prisma.project.findUnique({ where: { projectCode } });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        projectCode,
        owner: {
          connect: {
            id: decoded.userId
          },
        },
      },
    });

    res.status(201).json(project);

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
