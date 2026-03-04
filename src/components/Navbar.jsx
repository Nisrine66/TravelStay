import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, clearAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Listings', path: '/listings' },
    { name: 'Price Predictor', path: '/price-predictor' },
    { name: 'Profile', path: '/profile' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      clearAuth()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
      navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="backdrop-blur-lg bg-gradient-to-r from-dark-surface/80 to-dark-card/80 border-b border-glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Logo size="md" showText={true} />
        </div>

        {/* Desktop menu */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-base font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'text-accent-primary'
                    : 'text-muted hover:text-text'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-xs font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-text">{user?.name}</span>
                  <span className="text-sm text-muted">{user?.email}</span>
                </div>
              </div>

              <div className="w-px h-8 bg-glass hidden md:block"></div>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="btn-ghost flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-dark-hover rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-glass backdrop-blur-xl bg-dark-surface/50 px-4 py-4 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                isActive(item.path)
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-muted hover:bg-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-4 py-3 rounded-lg bg-dark-card/50 border border-glass">
            <p className="text-base font-semibold text-text">{user?.name}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="btn-ghost w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
