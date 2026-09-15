import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'

const TOKEN_KEY = 'campus_event_hub_admin_token'
const NAME_KEY = 'campus_event_hub_admin_name'
const COLLEGE_CODE_KEY = 'campus_event_hub_admin_college_code'
const COLLEGE_NAME_KEY = 'campus_event_hub_admin_college_name'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || '',
  )

  const [adminName, setAdminName] = useState(
    () => localStorage.getItem(NAME_KEY) || '',
  )

  const [collegeCode, setCollegeCode] = useState(
    () => localStorage.getItem(COLLEGE_CODE_KEY) || '',
  )

  const [collegeName, setCollegeName] = useState(
    () => localStorage.getItem(COLLEGE_NAME_KEY) || '',
  )

  const isAdminAuthenticated = !!token

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === TOKEN_KEY) {
        setToken(e.newValue || '')
      }

      if (e.key === NAME_KEY) {
        setAdminName(e.newValue || '')
      }

      if (e.key === COLLEGE_CODE_KEY) {
        setCollegeCode(e.newValue || '')
      }

      if (e.key === COLLEGE_NAME_KEY) {
        setCollegeName(e.newValue || '')
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  async function login(identifier, password) {
    const response = await api.post('/api/auth/login', {
      email: identifier,
      password: password,
    })

    const {
      token: jwtToken,
      name,
      collegeCode,
      collegeName,
    } = response.data

    localStorage.setItem(TOKEN_KEY, jwtToken)
    localStorage.setItem(NAME_KEY, name)
    localStorage.setItem(COLLEGE_CODE_KEY, collegeCode)
    localStorage.setItem(COLLEGE_NAME_KEY, collegeName)

    setToken(jwtToken)
    setAdminName(name)
    setCollegeCode(collegeCode)
    setCollegeName(collegeName)

    return true
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(NAME_KEY)
    localStorage.removeItem(COLLEGE_CODE_KEY)
    localStorage.removeItem(COLLEGE_NAME_KEY)

    setToken('')
    setAdminName('')
    setCollegeCode('')
    setCollegeName('')
  }

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminName,
        token,
        collegeCode,
        collegeName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}