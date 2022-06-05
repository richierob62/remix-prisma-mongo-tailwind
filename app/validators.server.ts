import type { AuthValidateType } from '~/utils/types.server'

export const validateAction = (value: any): AuthValidateType => {
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

export const validateEmail = (value: any): AuthValidateType => {
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

export const validatePassword = (value: any): AuthValidateType => {
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

export const validateFirstName = (value: any): AuthValidateType => {
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

export const validateLastName = (value: any): AuthValidateType => {
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
