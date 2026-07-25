import { SignJWT } from 'jose'
import type { UserRole } from '../types/user'

export async function generateAccessToken(
  userId: number,
  role: UserRole,
  tokenVersion: number,
  secret: string
) {
  const key = new TextEncoder().encode(secret)

  return await new SignJWT({
    user_id: userId,
    role,
    token_version: tokenVersion,
  })
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}