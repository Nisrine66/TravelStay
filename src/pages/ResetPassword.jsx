import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { resetPassword as submitReset } from '../api/auth'
import Toast from '../components/Toast'
import { Logo } from '../components/Logo'
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [invalidLink, setInvalidLink] = useState(false)

  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const password = watch('password')

  useEffect(() => {
    if (!token || !email) {
      setInvalidLink(true)
      setToast({
        message: 'Invalid or missing reset link.',
        type: 'error'
      })
    }
  }, [token, email])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await submitReset({
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        token
      })

      setToast({
        message: 'Password reset successfully!',
        type: 'success'
      })

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      const errorMsg = error.message || 'Failed to reset password. Link may have expired.'
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Set New Password</h1>
          <p className="text-muted">Create a strong password for your account</p>
        </div>

        {/* Card */}
        {invalidLink ? (
          <div className="card-glass p-8 space-y-6 animate-slide-up text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-text mb-2">Invalid Link</h2>
              <p className="text-muted">The password reset link is invalid or has expired.</p>
            </div>

            <div className="space-y-3">
              <a
                href="/forgot-password"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Request New Link <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/login"
                className="btn-secondary w-full"
              >
                Back to Login
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="card-glass p-8 space-y-5 animate-slide-up">
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Email Address</label>
              <div className="px-4 py-3 rounded-lg bg-dark-card/50 border border-glass text-text">
                {email}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-primary" />
                New Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                type="password"
                placeholder="At least 8 characters"
                className="input-glass"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                Confirm Password
              </label>
              <input
                {...register('password_confirmation', {
                  required: 'Confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                })}
                type="password"
                placeholder="Confirm password"
                className="input-glass"
              />
              {errors.password_confirmation && (
                <p className="error-message">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Info box */}
            <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-xl p-4">
              <p className="text-sm text-text">Password must be at least 8 characters and contain a mix of uppercase, lowercase, and numbers for security.</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 group"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            {/* Divider */}
            <div className="divider-glass"></div>

            {/* Back to Login */}
            <a href="/login" className="text-center text-accent-primary hover:text-accent-secondary font-medium transition-colors block">
              Back to Login
            </a>
          </form>
        )}
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

export default ResetPassword
