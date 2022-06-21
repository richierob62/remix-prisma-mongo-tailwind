import type { Zodiac } from '@prisma/client'

export interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
  zodiac: Zodiac
}
export interface LoginForm {
  email: string
  password: string
}

export interface ValidationType {
  value: any
  error?: string
}

export interface LoginErrors {
  _action?: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  zodiac?: string
}

export interface MessageErrors {
  recipientId?: string
  messageText?: string
  backgroundColor?: string
  textColor?: string
  emoji?: string
}
