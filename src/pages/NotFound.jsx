import { ArrowLeft, Home } from 'lucide-react'
import { Logo } from '../components/Logo'

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[120px] font-bold text-gradient opacity-80 mb-4">404</h1>
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Page Not Found</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/dashboard"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </a>
          <a
            href="/"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </a>
        </div>
      </div>
    </div>
  )
}

export default NotFound
