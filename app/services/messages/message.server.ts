import type { MessageForm } from '../../utils/types.server'
import type { Prisma } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const createMessage = async (messageData: MessageForm) => {
  const { messageText, userId, recipientId, style } = messageData

  await prisma.message.create({
    data: {
      messageText,
      author: {
        connect: {
          id: userId
        }
      },
      recipient: {
        connect: {
          id: recipientId
        }
      },
      style
    }
  })

  return
}

export const getOtherUsers = async (userId: string) => {
  return await prisma.user.findMany({
    where: { id: { not: userId } },
    orderBy: { profile: { firstName: 'asc' } }
  })
}

export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({ where: { id: userId } })
}

export const getFilteredMessages = async (
  userId: string,
  sortFilter: Prisma.MessageOrderByWithRelationInput,
  whereFilter: Prisma.MessageWhereInput
) => {
  return await prisma.message.findMany({
    where: { recipientId: userId, ...whereFilter },
    orderBy: sortFilter,
    select: {
      id: true,
      style: true,
      messageText: true,
      author: {
        select: {
          profile: true
        }
      },
      createdAt: true
    }
  })
}

export const getRecentMessages = async () => {
  return await prisma.message.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      style: {
        select: {
          emoji: true
        }
      },
      recipient: {
        select: {
          profile: true,
          id: true
        }
      }
    }
  })
}
