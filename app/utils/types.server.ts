import type {
  Message,
  MessageStyle,
  Profile,
  User,
  Zodiac
} from '@prisma/client'

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

export interface MessageForm {
  messageText: string
  userId: string
  recipientId: string
  style: MessageStyle
}

export interface MessageWithAuthor extends Message {
  author: {
    profile: Profile
  }
}

export interface MessageWithRecipient extends Message {
  recipient: User
}

export interface ProfileEditErrors {
  _action?: string
  firstName?: string
  lastName?: string
  zodiac?: string
}
