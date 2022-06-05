export interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
}
export interface LoginForm {
  email: string
  password: string
}

export interface AuthValidateType {
  value: any
  error?: string
}

export interface LoginErrors {
  _action?: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
}
