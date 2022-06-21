import {
  backgroundColorMap,
  colorMap,
  emojiMap,
  zodiacMap
} from './utils/constants'

import type { ValidationType } from '~/utils/types.server'

export const validateAction = (value: any): ValidationType => {
  const normalizedValue = `${value}`.toLowerCase().trim()
  if (normalizedValue === 'login' || normalizedValue === 'register') {
    return {
      value: normalizedValue
    }
  }
  return {
    error: 'form must have an _admin value of login or register',
    value: normalizedValue
  }
}

export const validateEmail = (value: any): ValidationType => {
  const normalizedEmail = `${value}`.toLowerCase().trim()
  if (/^[A-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Z0-9.-]+$/i.test(normalizedEmail))
    return {
      value: normalizedEmail
    }

  return {
    error: 'Invalid email',
    value: normalizedEmail
  }
}

export const validatePassword = (value: any): ValidationType => {
  const normalizedPassword = `${value}`
  if (normalizedPassword.length >= 6)
    return {
      value: normalizedPassword
    }

  return {
    error: 'Invalid password.  Must be at least 6 characters',
    value: normalizedPassword
  }
}

export const validateFirstName = (value: any): ValidationType => {
  const normalizedFirstName = `${value}`.trim()
  if (normalizedFirstName.length > 0)
    return {
      value: normalizedFirstName
    }

  return {
    error: 'First name or initial required',
    value: normalizedFirstName
  }
}

export const validateLastName = (value: any): ValidationType => {
  const normalizedLastName = `${value}`.trim()
  if (normalizedLastName.length > 0)
    return {
      value: normalizedLastName
    }

  return {
    error: 'Last name or initial required',
    value: normalizedLastName
  }
}

export const validateZodiac = (value: any): ValidationType => {
  const normalizedInput = `${value}`.trim().toUpperCase()

  const validSigns = Object.keys(zodiacMap)
  if (validSigns.includes(normalizedInput))
    return {
      value: normalizedInput
    }

  return {
    error: 'Choose a valid zodiac sign',
    value: normalizedInput
  }
}

export const validateMessageText = (value: any): ValidationType => {
  const normalizedInput = `${value}`.trim()
  if (normalizedInput.length > 0)
    return {
      value: normalizedInput
    }

  return {
    error: 'A message is required',
    value: normalizedInput
  }
}

export const validateBackgroundColor = (value: any): ValidationType => {
  const normalizedInput = `${value}`.trim().toUpperCase()

  const validColors = Object.keys(backgroundColorMap)
  if (validColors.includes(normalizedInput))
    return {
      value: normalizedInput
    }

  return {
    error: 'Choose a valid background color',
    value: normalizedInput
  }
}

export const validateTextColor = (value: any): ValidationType => {
  const normalizedInput = `${value}`.trim().toUpperCase()

  const validColors = Object.keys(colorMap)
  if (validColors.includes(normalizedInput))
    return {
      value: normalizedInput
    }

  return {
    error: 'Choose a valid text color',
    value: normalizedInput
  }
}

export const validateEmoji = (value: any): ValidationType => {
  const normalizedInput = `${value}`.trim().toUpperCase()

  const validEmojis = Object.keys(emojiMap)
  if (validEmojis.includes(normalizedInput))
    return {
      value: normalizedInput
    }

  return {
    error: 'Choose a valid emoji',
    value: normalizedInput
  }
}
