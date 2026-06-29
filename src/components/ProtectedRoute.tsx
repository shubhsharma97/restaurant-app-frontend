import { type ReactNode, type JSX } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Wraps routes that require authentication.
 * 
 * If user has token → allow access
 * If no token → redirect to login
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  // Check if token exists in localStorage
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    // Not authenticated → redirect to login
    return <Navigate to="/login" replace />
  }
  
  // Authenticated → show component
  return <>{children}</>
}