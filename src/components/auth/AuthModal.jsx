import { useState } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (mode === 'login') {
      const result = await login(email, password)
      if (result.success) {
        onClose()
        setEmail('')
        setPassword('')
      } else {
        setError(result.error)
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name')
        setIsLoading(false)
        return
      }
      const result = await signup(email, password, name)
      if (result.success) {
        onClose()
        setEmail('')
        setPassword('')
        setName('')
      } else {
        setError(result.error)
      }
    }
    setIsLoading(false)
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00D9FF] to-[#00c4e6] px-8 py-6">
          <h2 className="text-3xl font-bold text-black">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-black/80 mt-1">
            {mode === 'login'
              ? 'Sign in to access your decks and progress'
              : 'Join openSTUDY to save your study materials'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-black transition-all transform ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#00D9FF] hover:bg-[#00c4e6] hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={switchMode}
                className="text-[#00D9FF] font-semibold hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Guest Mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </form>

        {/* Benefits Section */}
        {mode === 'signup' && (
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">With an account, you can:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-[#00D9FF]">✓</span> Save your decks permanently
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00D9FF]">✓</span> Access your study materials from any device
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00D9FF]">✓</span> Track your progress over time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00D9FF]">✓</span> Share decks with friends
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
