import prisma from '../../utils/prisma' // Correto para default export
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { servico, horario, userId } = req.body
    const agendamento = await prisma.agendamento.create({
      data: { servico, horario: new Date(horario), userId },
    })
    res.status(200).json(agendamento)
  }
}