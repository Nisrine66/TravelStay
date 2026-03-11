import { useState, useEffect } from 'react'
import { User, MapPin, Home, Heart, Globe, Users, Save, CheckCircle, Edit2, X } from 'lucide-react'
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
  const [budgetError, setBudgetError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [initialPreferences, setInitialPreferences] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: ''
  })
  const [accountErrors, setAccountErrors] = useState({})
  const [savingAccount, setSavingAccount] = useState(false)

  const roomTypeOptions = [
    { id: 'apartment', label: 'Entire Apartment' },
    { id: 'house', label: 'Entire House' },
    { id: 'cabin', label: 'Cabin' },
    { id: 'penthouse', label: 'Penthouse' },
    { id: 'studio', label: 'Studio' },
    { id: 'loft', label: 'Loft' }
  ]

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating' },
    { id: 'pool', label: 'Pool' },
    { id: 'gym', label: 'Gym' },
    { id: 'parking', label: 'Parking' },
    { id: 'washer', label: 'Washer' }
  ]

  const userStats = [
    { label: 'Total Stays', value: '12' },
    { label: 'Countries Visited', value: '8' },
    { label: 'Wishlist Items', value: '24' },
    { label: 'Reviews Given', value: '11' }
  ]

  // Load user profile and preferences on component mount
  useEffect(() => {
    // Initialize account form with current user data
    if (user) {
      setAccountForm({
        name: user.name || '',
        email: user.email || ''
      })
    }
    
    // Set initial preferences with demo data
    const initialPrefs = {
      favoriteDestinations: ['Bangkok', 'Tokyo', 'Lisbon', 'Mexico City', 'Barcelona', 'Rome'],
      preferredRoomTypes: ['Entire apartment', 'Entire house'],
      budget: [40, 250],
      amenities: ['wifi', 'kitchen', 'ac', 'pool']
    }
    
    setPreferences(initialPrefs)
    setInitialPreferences(JSON.parse(JSON.stringify(initialPrefs)))
  }, [user])


  const handleSaveAccount = async () => {
    setAccountErrors({})
    
    // Basic validation
    const errors = {}
    if (!accountForm.name.trim()) {
      errors.name = 'Name is required'
    }
    if (!accountForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(accountForm.email)) {
      errors.email = 'Invalid email format'
    }
    
    if (Object.keys(errors).length > 0) {
      setAccountErrors(errors)
      return
    }
    
    try {
      setSavingAccount(true)
      
      // Update user context if available
      if (updateUser) {
        updateUser({ ...user, name: accountForm.name, email: accountForm.email })
      }
      
      setIsEditingProfile(false)
      
      setToast({
        message: 'Profile updated successfully!',
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to update account:', error)
      setToast({
        message: error.message || 'Failed to update profile',
        type: 'error'
      })
    } finally {
      setSavingAccount(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setAccountForm({
      name: user?.name || '',
      email: user?.email || ''
    })
    setAccountErrors({})
  }

  const validateBudgetRange = (min, max) => {
    if (min >= max) {
      setBudgetError('Maximum budget must be greater than minimum budget')
      return false
    } else {
      setBudgetError('')
      return true
    }
  }

  const handleMinBudgetChange = (e) => {
    const newMin = parseInt(e.target.value)
    const currentMax = preferences.budget[1]
    
    setPreferences(prev => ({
      ...prev,
      budget: [newMin, currentMax]
    }))
    
    validateBudgetRange(newMin, currentMax)
    checkForChanges()
  }

  const handleMaxBudgetChange = (e) => {
    const newMax = parseInt(e.target.value)
    const currentMin = preferences.budget[0]
    
    setPreferences(prev => ({
      ...prev,
      budget: [currentMin, newMax]
    }))
    
    validateBudgetRange(currentMin, newMax)
    checkForChanges()
  }

  const toggleAmenity = (id) => {
    setPreferences(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
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
    
    const current = JSON.stringify(preferences)
    const initial = JSON.stringify(initialPreferences)
    setHasChanges(current !== initial)
  }

  const handleSavePreferences = async () => {
    if (budgetError) {
      setToast({
        message: 'Please fix validation errors before saving',
        type: 'error'
      })
      return
    }

    // Update initial preferences to reflect saved state
    setInitialPreferences(JSON.parse(JSON.stringify(preferences)))
    setHasChanges(false)
    
    setToast({
      message: 'Preferences saved successfully!',
      type: 'success'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      {/* Animated background */}
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
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* User Header */}
          <div className="card-glass p-8 mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-text block mb-2">Name</label>
                      <input
                        type="text"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                        className={`input-glass w-full ${
                          accountErrors.name ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder="Enter your name"
                      />
                      {accountErrors.name && (
                        <p className="text-xs text-red-500 mt-1">{accountErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text block mb-2">Email</label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`input-glass w-full ${
                          accountErrors.email ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder="Enter your email"
                      />
                      {accountErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{accountErrors.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveAccount}
                        disabled={savingAccount}
                        className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingAccount ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={savingAccount}
                        className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-text mb-2">{user?.name}</h1>
                    <p className="text-muted mb-4">{user?.email}</p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
            {userStats.map((stat, idx) => (
              <div key={idx} className="card-glass p-6 text-center">
                <p className="text-3xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Favorite Destinations */}
            <div className="animate-slide-up">
              <div className="card-glass p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-text">Favorite Destinations</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Bangkok', 'Tokyo', 'Lisbon', 'Mexico City', 'Barcelona', 'Rome'].map((dest) => (
                    <button
                      key={dest}
                      onClick={() => toggleDestination(dest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        preferences.favoriteDestinations.includes(dest)
                          ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                          : 'bg-white/5 border border-white/10 text-text hover:bg-white/10'
                      }`}
                    >
                      <MapPin className="w-4 h-4 inline mr-2" />
                      {dest}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-muted pt-4">
                  {preferences.favoriteDestinations.length} destination{preferences.favoriteDestinations.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>

            {/* Preferred Room Types */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-glass p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-text">Preferred Room Types</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {roomTypeOptions.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => toggleRoomType(room.label)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        preferences.preferredRoomTypes.includes(room.label)
                          ? 'bg-accent-primary/20 border border-accent-primary text-accent-primary'
                          : 'bg-white/5 border border-white/10 text-text hover:bg-white/10'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-muted pt-4">
                  {preferences.preferredRoomTypes.length} room type{preferences.preferredRoomTypes.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>

            {/* Budget Range */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-glass p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-text">Budget Range</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text block mb-2">Minimum: ${preferences.budget[0]}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={preferences.budget[0]}
                      onChange={handleMinBudgetChange}
                      className={`w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer ${
                        budgetError ? 'border-red-500' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text block mb-2">Maximum: ${preferences.budget[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={preferences.budget[1]}
                      onChange={handleMaxBudgetChange}
                      className={`w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer ${
                        budgetError ? 'border-red-500' : ''
                      }`}
                    />
                  </div>

                  <div className={`bg-accent-primary/10 border rounded-lg p-3 text-sm ${
                    budgetError ? 'border-red-500 bg-red-500/10' : 'border-accent-primary/20'
                  }`}>
                    <p className={`font-semibold ${
                      budgetError ? 'text-red-500' : 'text-text'
                    }`}>
                      {budgetError || `$${preferences.budget[0]} - $${preferences.budget[1]} per night`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferred Amenities */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-glass p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-text">Preferred Amenities</h2>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        preferences.amenities.includes(amenity.id)
                          ? 'bg-accent-secondary/20 border border-accent-secondary text-accent-secondary'
                          : 'bg-white/5 border border-white/10 text-text hover:bg-white/10'
                      }`}
                    >
                      {amenity.label}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-muted pt-4">
                  {preferences.amenities.length} amenities selected
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleSavePreferences}
              disabled={!hasChanges || saving || loading}
              className={`btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                hasChanges && !saving && !loading ? 'animate-pulse' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : hasChanges ? (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  All Saved
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
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

export default Profile