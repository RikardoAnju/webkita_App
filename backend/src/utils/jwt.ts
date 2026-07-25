import { SignJWT } from 'jose'
import type { UserRole } from '../types/user'

export async function generateAccessToken(
  userId: number,
  role: UserRole,
  secret: string
) {
  const key = new TextEncoder().encode(secret)

  return await new SignJWT({
    user_id: userId,
    role,
  })
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}