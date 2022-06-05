import type { LoginForm, RegisterForm } from '~/utils/types.server'
import { createCookieSessionStorage, json, redirect } from '@remix-run/node'

import bcrypt from 'bcryptjs'
import { createUser } from '~/services/user/user.server'
import { prisma } from '~/services/prisma.server'

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) throw new Error('SESSION_SECRET is not set')

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'boiler-plate',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export const register = async (form: RegisterForm) => {
  const userExists = await prisma.user.count({ where: { email: form.email } })

  if (userExists) {
    return json({ error: 'That email is already registered' }, { status: 400 })
  }

  const newUser = await createUser(form)

  if (!newUser) {
    return json(
      {
        error: 'There was an error creating the new user',
        fields: { ...form }
      },
      { status: 500 }
    )
  }

  return createUserSession(newUser.id, '/')
}

export const login = async (form: LoginForm) => {
  const user = await prisma.user.findUnique({ where: { email: form.email } })

  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json({ error: 'Incorrect username/password' }, { status: 400 })
  }

  return createUserSession(user.id, '/')
}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await sessionStorage.getSession()
  session.set('userId', userId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session)
    }
  })
}

export const getUserSession = (request: Request) => {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
}

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export const getUser = async (request: Request) => {
  const userId = await getUserId(request)
  if (!userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        profile: true
      }
    })
    return user
  } catch (e) {
    throw logout(request)
  }
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  })
}
