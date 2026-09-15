import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Guards frontend-only admin routes. This checks a local demo session flag,
// nothing more — it does not verify anything with the backend. Real route
// protection will come from the Spring Security + JWT work later.
export default function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
