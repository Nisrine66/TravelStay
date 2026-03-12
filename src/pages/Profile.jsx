import { useState, useEffect } from 'react'
import { User, Save, CheckCircle, Edit2, X, Calendar, BadgeCheck, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [preferences, setPreferences] = useState({
    favoriteDestinations: [],
    preferredRoomTypes: [],
    budget: [40, 250],
    amenities: []
  })
  const [budgetError, setBudgetError]         = useState('')
  const [loading, setLoading]                 = useState(false)
  const [saving, setSaving]                   = useState(false)
  const [toast, setToast]                     = useState(null)
  const [hasChanges, setHasChanges]           = useState(false)
  const [initialPreferences, setInitialPreferences] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [accountForm, setAccountForm]         = useState({ name: '', email: '' })
  const [accountErrors, setAccountErrors]     = useState({})
  const [savingAccount, setSavingAccount]     = useState(false)

  const roomTypeOptions = [
    { id: 'apartment', label: 'Entire Apartment' },
    { id: 'house',     label: 'Entire House' },
    { id: 'cabin',     label: 'Cabin' },
    { id: 'penthouse', label: 'Penthouse' },
    { id: 'studio',    label: 'Studio' },
    { id: 'loft',      label: 'Loft' }
  ]

  const amenityOptions = [
    { id: 'wifi',    label: 'WiFi' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'ac',      label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating' },
    { id: 'pool',    label: 'Pool' },
    { id: 'gym',     label: 'Gym' },
    { id: 'parking', label: 'Parking' },
    { id: 'washer',  label: 'Washer' }
  ]

  const userStats = [
    { label: 'Total Stays',       value: '12' },
    { label: 'Countries Visited', value: '8' },
    { label: 'Wishlist Items',    value: '24' },
    { label: 'Reviews Given',     value: '11' }
  ]

  useEffect(() => {
    if (user) {
      setAccountForm({ name: user.name || '', email: user.email || '' })
    }
    const initialPrefs = {
      favoriteDestinations: ['Bangkok', 'Tokyo', 'Lisbon', 'Mexico City', 'Barcelona', 'Rome'],
      preferredRoomTypes:   ['Entire apartment', 'Entire house'],
      budget:               [40, 250],
      amenities:            ['wifi', 'kitchen', 'ac', 'pool']
    }
    setPreferences(initialPrefs)
    setInitialPreferences(JSON.parse(JSON.stringify(initialPrefs)))
  }, [user])

  // ── Account ────────────────────────────────────────────────────────────────
  const handleSaveAccount = async () => {
    setAccountErrors({})
    const errors = {}
    if (!accountForm.name.trim())  errors.name  = 'Name is required'
    if (!accountForm.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(accountForm.email)) errors.email = 'Invalid email format'
    if (Object.keys(errors).length > 0) { setAccountErrors(errors); return }
    try {
      setSavingAccount(true)
      if (updateUser) updateUser({ ...user, name: accountForm.name, email: accountForm.email })
      setIsEditingProfile(false)
      setToast({ message: 'Profile updated successfully!', type: 'success' })
    } catch (error) {
      setToast({ message: error.message || 'Failed to update profile', type: 'error' })
    } finally {
      setSavingAccount(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setAccountForm({ name: user?.name || '', email: user?.email || '' })
    setAccountErrors({})
  }

  // ── Preferences ────────────────────────────────────────────────────────────
  const validateBudgetRange = (min, max) => {
    if (min >= max) { setBudgetError('Maximum budget must be greater than minimum budget'); return false }
    setBudgetError(''); return true
  }

  const handleMinBudgetChange = (e) => {
    const newMin = parseInt(e.target.value)
    setPreferences(prev => ({ ...prev, budget: [newMin, prev.budget[1]] }))
    validateBudgetRange(newMin, preferences.budget[1])
    checkForChanges()
  }

  const handleMaxBudgetChange = (e) => {
    const newMax = parseInt(e.target.value)
    setPreferences(prev => ({ ...prev, budget: [prev.budget[0], newMax] }))
    validateBudgetRange(preferences.budget[0], newMax)
    checkForChanges()
  }

  const toggleAmenity = (id) => {
    setPreferences(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter(a => a !== id) : [...prev.amenities, id]
    }))
    checkForChanges()
  }

  const toggleDestination = (dest) => {
    setPreferences(prev => ({
      ...prev,
      favoriteDestinations: prev.favoriteDestinations.includes(dest)
        ? prev.favoriteDestinations.filter(d => d !== dest)
        : [...prev.favoriteDestinations, dest]
    }))
    checkForChanges()
  }

  const toggleRoomType = (roomType) => {
    setPreferences(prev => ({
      ...prev,
      preferredRoomTypes: prev.preferredRoomTypes.includes(roomType)
        ? prev.preferredRoomTypes.filter(r => r !== roomType)
        : [...prev.preferredRoomTypes, roomType]
    }))
    checkForChanges()
  }

  const checkForChanges = () => {
    if (!initialPreferences) return
    setHasChanges(JSON.stringify(preferences) !== JSON.stringify(initialPreferences))
  }

  const handleSavePreferences = async () => {
    if (budgetError) { setToast({ message: 'Please fix validation errors before saving', type: 'error' }); return }
    setInitialPreferences(JSON.parse(JSON.stringify(preferences)))
    setHasChanges(false)
    setToast({ message: 'Preferences saved successfully!', type: 'success' })
  }

  // ── Member since ───────────────────────────────────────────────────────────
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'March 2026'

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      {loading ? (
        <main className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text">Loading profile...</p>
          </div>
        </main>
      ) : (
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">

          {/* ── Hero Card ── */}
          <div className="card-glass p-10 mb-8 animate-fade-in flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-4 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>

            {/* Name & Email — or edit form */}
            {isEditingProfile ? (
              <div className="w-full max-w-sm space-y-4 mt-2">
                <div className="text-left">
                  <label className="text-sm font-medium text-text block mb-1">Name</label>
                  <input
                    type="text"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`input-glass w-full ${accountErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Your name"
                  />
                  {accountErrors.name && <p className="text-xs text-red-500 mt-1">{accountErrors.name}</p>}
                </div>
                <div className="text-left">
                  <label className="text-sm font-medium text-text block mb-1">Email</label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`input-glass w-full ${accountErrors.email ? 'border-red-500' : ''}`}
                    placeholder="Your email"
                  />
                  {accountErrors.email && <p className="text-xs text-red-500 mt-1">{accountErrors.email}</p>}
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={handleSaveAccount} disabled={savingAccount} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                    {savingAccount ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                  <button onClick={handleCancelEdit} disabled={savingAccount} className="btn-secondary text-sm flex items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-text mb-2">{user?.name}</h1>
                <div className="flex items-center gap-2 text-muted mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>

                {/* Verified badge */}
                <div className="flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/30 text-accent-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                  <BadgeCheck className="w-4 h-4" />
                  Verified Traveler
                </div>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="btn-secondary text-sm flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              </>
            )}
          </div>

          {/* ── Member Since + Verified Status ── */}
          <div className="grid grid-cols-2 gap-4 mb-8 animate-slide-up">
            <div className="card-glass p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-accent-primary" />
              </div>
              <p className="text-2xl font-bold text-gradient mb-1">{memberSince}</p>
              <p className="text-sm text-muted">Member Since</p>
            </div>
            <div className="card-glass p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center mb-3">
                <BadgeCheck className="w-6 h-6 text-accent-primary" />
              </div>
              <p className="text-2xl font-bold text-gradient mb-1">Verified</p>
              <p className="text-sm text-muted">Verified Status</p>
            </div>
          </div>



        </main>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default Profile