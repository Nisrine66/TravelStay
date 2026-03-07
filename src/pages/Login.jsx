import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import Logo from '../components/Logo'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

export const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const onSubmit = async (data, e) => {
    e?.preventDefault()
    setLoading(true)
    setLoginError('')
    clearErrors()
    
    try {
      console.log('Attempting login with:', data.email)

      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: data.email,
        password: data.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('Login response:', response.data)
      
      setAuth(response.data.user, response.data.access_token, 'token')

      setToast({
        message: 'Welcome back! Redirecting...',
        type: 'success'
      })

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMsg = 'Invalid email or password'
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.message) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      
      setLoginError(errorMsg)
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const onError = (errors, e) => {
    e?.preventDefault()
    console.log('Form validation errors:', errors)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
          <p className="text-muted">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="card-glass p-8 space-y-5 animate-slide-up" noValidate>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-primary" />
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-glass pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-accent-primary hover:text-accent-secondary transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 group"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          {loginError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500 text-sm font-medium">{loginError}</p>
            </div>
          )}

          <div className="divider-glass"></div>

          <p className="text-center text-sm text-muted">
            Don't have an account?{' '}
            <a href="/register" className="text-accent-primary hover:text-accent-secondary font-medium transition-colors">
              Sign Up
            </a>
          </p>
        </form>

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