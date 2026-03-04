import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import Logo from '../components/Logo'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { login } from '../api/auth'

export const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      console.log('Attempting login with:', data.email)
      const response = await login(data.email, data.password)
      console.log('Login response:', response)
      
      // Store auth data
      setAuth(response.user, response.access_token, 'token')

      setToast({
        message: 'Welcome back! Redirecting...',
        type: 'success'
      })

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg = error.message || 'Login failed. Please try again.'
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="card-glass p-8 space-y-5 animate-slide-up">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-primary" />
              Email Address
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email'
                }
              })}
              type="email"
              placeholder="you@example.com"
              className="input-glass"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-primary" />
              Password
            </label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              placeholder="••••••••"
              className="input-glass"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-accent-primary hover:text-accent-secondary transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 group"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          {/* Divider */}
          <div className="divider-glass"></div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted">
            Don't have an account?{' '}
            <a href="/register" className="text-accent-primary hover:text-accent-secondary font-medium transition-colors">
              Sign Up
            </a>
          </p>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-muted">
          <p>Secure login • Protected with industry-standard encryption</p>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Login
