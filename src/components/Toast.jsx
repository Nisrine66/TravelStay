import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true)
      }, duration - 300)

      const timer = setTimeout(() => {
        setVisible(false)
        onClose && onClose()
      }, duration)

      return () => {
        clearTimeout(timer)
        clearTimeout(exitTimer)
      }
    }
  }, [duration, onClose])

  if (!visible) return null

  const toastConfig = {
    success: {
      icon: CheckCircle2,
      bg: 'from-accent-emerald/20 to-accent-emerald/10',
      border: 'border-accent-emerald/30',
      text: 'text-accent-emerald',
      glow: 'shadow-green-500/20'
    },
    error: {
      icon: AlertCircle,
      bg: 'from-red-500/20 to-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      glow: 'shadow-red-500/20'
    },
    info: {
      icon: Info,
      bg: 'from-accent-primary/20 to-accent-primary/10',
      border: 'border-accent-primary/30',
      text: 'text-accent-primary',
      glow: 'shadow-accent-primary/20'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'from-yellow-500/20 to-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/20'
    }
  }

  const config = toastConfig[type] || toastConfig.info
  const Icon = config.icon

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`card-glass backdrop-blur-xl bg-gradient-to-br ${config.bg} border ${config.border} p-4 flex items-center gap-3 rounded-lg`}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.text}`} />
        <p className="text-sm font-medium text-text">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => {
              setVisible(false)
              onClose && onClose()
            }, 300)
          }}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4 text-muted" />
        </button>
      </div>
    </div>
  )
}

export default Toast
