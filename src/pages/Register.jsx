import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import Logo from '../components/Logo'
import { User, Mail, Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { register as registerUser } from '../api/auth'

export const Register = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await registerUser(data)
      
      setToast({
        message: 'Account created successfully! Please check your email to verify your account.',
        type: 'success'
      })

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (error) {
      let errorMsg = 'Registration failed. Please try again.'
      
      if (error.errors) {
        // Handle validation errors from backend
        const firstError = Object.values(error.errors)[0]
        errorMsg = Array.isArray(firstError) ? firstError[0] : firstError
      } else if (error.message) {
        errorMsg = error.message
      }
      
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
          <p className="text-muted">Join us in just a few steps</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="card-glass p-8 space-y-5 animate-slide-up">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <User className="w-4 h-4 text-accent-primary" />
              Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="Elina"
              className="input-glass"
            />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

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
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-primary" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('password_confirmation', {
                  required: 'Confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className="input-glass pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="error-message">{errors.password_confirmation.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 group mt-6"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          {/* Divider */}
          <div className="divider-glass"></div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-accent-primary hover:text-accent-secondary font-medium transition-colors">
              Sign In
            </a>
          </p>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted">
          <p>By signing up, you agree to our Terms and Privacy Policy</p>
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

export default Register
