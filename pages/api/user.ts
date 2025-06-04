import prisma from '../../utils/prisma' // Correto para default export
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { nome, telefone, email } = req.body
    const user = await prisma.user.create({
      data: { nome, telefone, email },
    })
    res.status(200).json(user)
  }
}