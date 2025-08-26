import { Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { getCurrentUser } from '../lib/auth'

export default function AdminRoute({ children }: { children: ReactElement }) {
  const user = getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'OWNER')) return <Navigate to="/" replace />
  return children
}

