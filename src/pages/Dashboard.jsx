import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { Mail, Shield, Clock, CheckCircle2, ArrowRight } from 'lucide-react'

export const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <div className="mb-2">
            <h1 className="text-3xl sm:text-5xl font-bold text-text mb-2">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-lg text-muted">Your account is secure and ready to use</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Account Info Card */}
          <div className="card-glass p-6 space-y-4 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text mb-4">Account Information</h2>
              </div>
              <div className="p-3 rounded-lg bg-accent-primary/20">
                <Shield className="w-6 h-6 text-accent-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-glass">
                <span className="text-muted">Full Name</span>
                <span className="text-text font-medium">{user?.name}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-glass">
                <span className="text-muted">Email Address</span>
                <span className="text-text font-medium truncate">{user?.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted">Status</span>
                <div className="badge-verified">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="card-glass p-6 space-y-4 animate-slide-up stagger-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text mb-4">Security</h2>
              </div>
              <div className="p-3 rounded-lg bg-accent-emerald/20">
                <CheckCircle2 className="w-6 h-6 text-accent-emerald" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-hover/50 border border-glass">
                <div className="w-2 h-2 rounded-full bg-accent-emerald"></div>
                <span className="text-sm text-text">Two-Factor Authentication</span>
                <span className="ml-auto text-xs text-muted">Optional</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-hover/50 border border-glass">
                <div className="w-2 h-2 rounded-full bg-accent-emerald"></div>
                <span className="text-sm text-text">Login Sessions</span>
                <span className="ml-auto text-xs text-accent-emerald">Active</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-hover/50 border border-glass">
                <div className="w-2 h-2 rounded-full bg-accent-primary"></div>
                <span className="text-sm text-text">Password Reset Available</span>
                <span className="ml-auto text-xs text-muted">Anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-glass p-6 hover:bg-gradient-to-br hover:from-accent-primary/10 hover:to-accent-secondary/10 cursor-pointer transition-all group animate-slide-up stagger-2">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent-primary/20 group-hover:bg-accent-primary/30 transition-colors">
                <Mail className="w-6 h-6 text-accent-primary" />
              </div>
              <ArrowRight className="w-5 h-5 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text">Manage Email</h3>
            <p className="text-sm text-muted mt-1">Update your email address</p>
          </div>

          <div className="card-glass p-6 hover:bg-gradient-to-br hover:from-accent-secondary/10 hover:to-accent-primary/10 cursor-pointer transition-all group animate-slide-up stagger-3">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent-secondary/20 group-hover:bg-accent-secondary/30 transition-colors">
                <Shield className="w-6 h-6 text-accent-secondary" />
              </div>
              <ArrowRight className="w-5 h-5 text-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text">Change Password</h3>
            <p className="text-sm text-muted mt-1">Update your security</p>
          </div>

          <div className="card-glass p-6 hover:bg-gradient-to-br hover:from-accent-cyan/10 hover:to-accent-emerald/10 cursor-pointer transition-all group animate-slide-up stagger-4">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent-cyan/20 group-hover:bg-accent-cyan/30 transition-colors">
                <Clock className="w-6 h-6 text-accent-cyan" />
              </div>
              <ArrowRight className="w-5 h-5 text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text">Activity Log</h3>
            <p className="text-sm text-muted mt-1">View login history</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="card-glass p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-text mb-1">Getting Started</h2>
          <p className="text-muted mb-6">Here are some recommended next steps</p>

          <ol className="space-y-3">
            <li className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary/20 flex-shrink-0 font-semibold text-accent-primary">1</div>
              <div>
                <p className="text-text font-medium">Secure your account</p>
                <p className="text-sm text-muted">Enable two-factor authentication for added security</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-secondary/20 flex-shrink-0 font-semibold text-accent-secondary">2</div>
              <div>
                <p className="text-text font-medium">Complete your profile</p>
                <p className="text-sm text-muted">Add a profile picture and additional information</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-emerald/20 flex-shrink-0 font-semibold text-accent-emerald">3</div>
              <div>
                <p className="text-text font-medium">Explore features</p>
                <p className="text-sm text-muted">Learn about all the tools available to you</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-muted">
          <p>Need help? <a href="#" className="text-accent-primary hover:text-accent-secondary transition-colors">Contact support</a></p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
