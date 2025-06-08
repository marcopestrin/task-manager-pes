import { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0), // delete cookie
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }));

  res.status(200).json({ message: 'Logged out' });
}
