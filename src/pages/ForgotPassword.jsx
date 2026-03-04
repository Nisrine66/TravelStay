import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { forgotPassword as requestReset } from '../api/auth'
import Toast from '../components/Toast'
import { Logo } from '../components/Logo'
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react'

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await requestReset(data.email)
      setSent(true)
      setToast({
        message: 'Password reset email sent! Check your inbox.',
        type: 'success'
      })
    } catch (error) {
      const errorMsg = error.message || 'Failed to send reset email. Please try again.'
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Reset Password</h1>
          <p className="text-muted">Enter your email to receive a reset link</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="card-glass p-8 space-y-6 animate-slide-up">
          {!sent ? (
            <>
              {/* Email Input */}
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

              {/* Info box */}
              <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-xl p-4">
                <p className="text-sm text-text">We'll send you an email with a link to reset your password. The link will expire in 60 minutes.</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              {/* Divider */}
              <div className="divider-glass"></div>

              {/* Back to Login */}
              <a
                href="/login"
                className="flex items-center justify-center gap-2 text-accent-primary hover:text-accent-secondary font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </a>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-emerald to-accent-emerald flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-text mb-2">Email Sent!</h2>
                  <p className="text-muted">Check your inbox for the password reset link</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-text">Next steps:</p>
                <ol className="text-sm text-muted space-y-1">
                  <li>1. Open your email and find the reset link</li>
                  <li>2. Click the link to enter a new password</li>
                  <li>3. Return to login with your new password</li>
                </ol>
              </div>

              {/* Back Button */}
              <a
                href="/login"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </a>
            </>
          )}
        </form>
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

export default ForgotPassword
