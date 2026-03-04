import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resendVerification, verifyEmail } from '../api/auth'
import Toast from '../components/Toast'
import Logo from '../components/Logo'
import { Mail, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react'

export const VerifyEmail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const [resending, setResending] = useState(false)
  const [toast, setToast] = useState(null)

  const verificationToken = searchParams.get('token')

  useEffect(() => {
    if (verificationToken) {
      verifyTokenFromEmail()
    } else {
      setLoading(false)
    }
  }, [verificationToken])

  const verifyTokenFromEmail = async () => {
    try {
      await verifyEmail(verificationToken)
      setVerified(true)
      setToast({
        message: 'Email verified successfully!',
        type: 'success'
      })
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      const errorMsg = error.message || 'Verification failed or link expired.'
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setResending(true)
    try {
      await resendVerification()
      setToast({
        message: 'Verification email sent! Check your inbox.',
        type: 'success'
      })
    } catch (error) {
      const errorMsg = error.message || 'Failed to resend verification email.'
      setToast({ message: errorMsg, type: 'error' })
    } finally {
      setResending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Logo size="md" />
          </div>
          <p className="text-muted">Verifying email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>

      <div className="relative z-10 w-full max-w-md">
        <form className="card-glass p-8 text-center space-y-6 animate-slide-up">
          {verified ? (
            <>
              {/* Success State */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-emerald to-accent-emerald flex items-center justify-center animate-pulse">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-text mb-2">Email Verified!</h1>
                  <p className="text-muted">Your account is now fully activated</p>
                </div>

                <a
                  href="/login"
                  className="btn-primary flex items-center justify-center gap-2 group"
                >
                  Go to Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Pending State */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Logo size="lg" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-text mb-2">Verify Your Email</h1>
                  <p className="text-muted">We've sent a verification link to your email address</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-xl p-4 space-y-3">
                <p className="text-sm text-text">Click the link in your email to verify your account. The link expires in 24 hours.</p>

                <p className="text-xs text-muted">Didn't see the email? Check your spam folder or request a new link below.</p>
              </div>

              {/* Resend Button */}
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resending}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>

              {/* Back to Login */}
              <p className="text-sm text-muted">
                Already verified?{' '}
                <a href="/login" className="text-accent-primary hover:text-accent-secondary font-medium">
                  Go to Login
                </a>
              </p>
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

export default VerifyEmail
