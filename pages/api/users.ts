import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const searchTerm = Array.isArray(query) ? query[0] : query;

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: searchTerm,
      }
    },
    select: {
      id: true,
      username: true,
    },
  });
  res.status(200).json(users);
}
