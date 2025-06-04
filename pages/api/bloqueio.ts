import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../utils/prisma' // Correto para default export

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { horario, motivo } = req.body;
    const bloqueio = await prisma.bloqueio.create({
      data: { horario: new Date(horario), motivo },
    });
    res.status(200).json(bloqueio);
  }
}