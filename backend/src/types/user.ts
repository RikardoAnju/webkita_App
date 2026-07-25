export type UserRole = 'user' | 'admin' | 'developer'

export type User = {
  id: number
  username: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  password: string
  group_id: number
  role: UserRole
  is_aktif: string
  subscribe_newsletter: boolean
  email_verified_at: string | null
  verification_token: string | null
  token_expires_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type UserResponse = Omit<User, 'password' | 'verification_token' | 'token_expires_at' | 'deleted_at'>

export type LoginEmailRequest = {
  email: string
  password: string
}

export type LoginUsernameRequest = {
  username: string
  password: string
}

export type RegisterRequest = {
  username: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  password: string
  group_id?: number
  subscribe_newsletter?: boolean
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  otp: string
  otp_token: string
  new_password: string
  confirm_password: string
}