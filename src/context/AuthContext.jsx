import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('openStudy_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('openStudy_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('openStudy_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('openStudy_user')
    }
  }, [user])

  const signup = async (email, password, name) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('openStudy_users') || '{}')

      if (existingUsers[email]) {
        throw new Error('An account with this email already exists')
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        createdAt: new Date().toISOString(),
        avatar: getRandomAvatar()
      }

      // Store password hash (in production, this should be done server-side)
      // For now, we'll store a simple hash
      const passwordHash = btoa(password) // NOT secure, just for demo

      existingUsers[email] = {
        ...newUser,
        passwordHash
      }

      localStorage.setItem('openStudy_users', JSON.stringify(existingUsers))
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('openStudy_users') || '{}')
      const userAccount = existingUsers[email]

      if (!userAccount) {
        throw new Error('No account found with this email')
      }

      // Verify password
      const passwordHash = btoa(password)
      if (passwordHash !== userAccount.passwordHash) {
        throw new Error('Incorrect password')
      }

      // Remove password hash from user object
      const { passwordHash: _, ...userWithoutPassword } = userAccount
      setUser(userWithoutPassword)

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not logged in' }

    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      // Update in stored users
      const existingUsers = JSON.parse(localStorage.getItem('openStudy_users') || '{}')
      if (existingUsers[user.email]) {
        existingUsers[user.email] = {
          ...existingUsers[user.email],
          ...updates
        }
        localStorage.setItem('openStudy_users', JSON.stringify(existingUsers))
      }

      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper function to generate random avatar emoji
const getRandomAvatar = () => {
  const avatars = ['👨', '👩', '🧑', '👦', '👧', '🧒', '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍💻', '👩‍💻', '🧑‍💻']
  return avatars[Math.floor(Math.random() * avatars.length)]
}
