import { Profile } from '@prisma/client'
import type { RegisterForm } from '~/utils/types.server'
import bcrypt from 'bcryptjs'
import { prisma } from '~/services/prisma.server'

export const createUser = async (userData: RegisterForm) => {
  const { email, firstName, lastName, password, zodiac } = userData

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      profile: {
        firstName,
        lastName,
        zodiac
      }
    }
  })

  return { id: newUser.id, email: newUser.email }
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

export const updateUser = async (userId: string, profile: Partial<Profile>) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { profile: { update: profile } }
  })
}

export const deleteUser = async (userId: string) => {
  return await prisma.user.delete({
    where: { id: userId }
  })
}
