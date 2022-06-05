import type { RegisterForm } from '~/utils/types.server'
import bcrypt from 'bcryptjs'
import { prisma } from '~/services/prisma.server'

export const createUser = async (userData: RegisterForm) => {
  const { email, firstName, lastName, password } = userData

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      profile: {
        firstName,
        lastName
      }
    }
  })

  return { id: newUser.id, email: newUser.email }
}
