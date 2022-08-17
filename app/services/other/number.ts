import { prisma } from '~/services/prisma.server'

export const bumpNumber = async (amt: number) => {
  const number = (await prisma.number.findMany())[0]

  if (number) {
    await prisma.number.update({
      where: { id: number?.id },
      data: { number: (number?.number || 0) + amt }
    })
  } else {
    await prisma.number.create({
      data: { number: 1 }
    })
  }

  return
}

export const getCurrentNumber = async () => {
  const number = (await prisma.number.findMany())[0]

  return number?.number || 0
}
