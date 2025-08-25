import { jwtDecode } from 'jwt-decode'

export type DecodedToken = { sub: string; role?: string; name?: string; exp?: number }

export function decodeToken(token: string | null) {
  if (!token) return null
  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}

export function getCurrentUser() {
  const token = localStorage.getItem('token')
  const decoded = decodeToken(token)
  if (!decoded) return null
  return { email: decoded.sub, fullName: decoded.name || '', role: (decoded.role || 'CUSTOMER') as 'ADMIN'|'OWNER'|'CUSTOMER' }
}