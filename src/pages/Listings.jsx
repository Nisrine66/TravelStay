import { useState, useEffect } from 'react'
import { Star, MapPin, Sliders } from 'lucide-react'
import Navbar from '../components/Navbar'

const Listings = () => {
  const [properties, setProperties]       = useState([])
  const [filtered, setFiltered]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [apiError, setApiError]           = useState(null)
  const [priceRange, setPriceRange]       = useState([0, 500])
  const [roomType, setRoomType]           = useState('all')
  const [minRating, setMinRating]         = useState(0)
  const [minNights, setMinNights]         = useState(1)
  const [minNightsError, setMinNightsError] = useState('')
  const [city, setCity]                   = useState('all')

  // ── Fetch listings from Flask on mount ────────────────────────────────────
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      setApiError(null)
      try {
        const response = await fetch('http://127.0.0.1:8000/api/top-listings')
        const result   = await response.json()

        if (result.error) {
          setApiError(result.error)
        } else {
          setProperties(result.listings)
          setFiltered(result.listings)
        }
      } catch (err) {
        console.error("❌ Failed to fetch listings:", err)
        setApiError('Could not connect to the AI service. Make sure Flask is running.')
      }
      setLoading(false)
    }

    fetchListings()
  }, [])

  // ── Apply filters whenever any filter changes ──────────────────────────────
  useEffect(() => {
    if (!properties.length) return

    const result = properties.filter(prop => {
      const priceMatch  = prop.price >= priceRange[0] && prop.price <= priceRange[1]
      const roomMatch   = roomType === 'all' || prop.room_type?.toLowerCase().includes(roomType.toLowerCase())
      const ratingMatch = prop.rating >= minRating
      const cityMatch   = city === 'all' || prop.city?.toLowerCase() === city.toLowerCase()
      return priceMatch && roomMatch && ratingMatch && cityMatch && !minNightsError
    })

    setFiltered(result)
  }, [priceRange, roomType, minRating, minNights, minNightsError, city, properties])

  const validateMinNights = (value) => {
    const num = parseInt(value)
    if (isNaN(num) || num < 1) {
      setMinNightsError('Minimum nights must be at least 1')
      return false
    } else if (num > 20) {
      setMinNightsError('Minimum nights cannot exceed 20')
      return false
    } else {
      setMinNightsError('')
      return true
    }
  }

  const handleMinNightsChange = (e) => {
    const value = e.target.value
    setMinNights(value === '' ? '' : parseInt(value))
    validateMinNights(value)
  }

  const handleReset = () => {
    setPriceRange([0, 500])
    setRoomType('all')
    setMinRating(0)
    setMinNights(1)
    setMinNightsError('')
    setCity('all')
  }

  // ── Unique cities from data ────────────────────────────────────────────────
  const availableCities = ['all', ...new Set(properties.map(p => p.city).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-text mb-8 animate-fade-in">Find Your Perfect Stay</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ── Sidebar Filters ── */}
            <div className="animate-slide-up">
              <div className="card-glass p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-bold text-text">Filters</h2>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-glass w-full text-sm capitalize"
                  >
                    {availableCities.map(c => (
                      <option key={c} value={c} className="capitalize">
                        {c === 'all' ? 'All Cities' : c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent-primary" />
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0" max="500"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0" max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>€{priceRange[0]}</span>
                      <span>€{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="input-glass w-full text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="Entire home">Entire Home</option>
                    <option value="Private room">Private Room</option>
                    <option value="Shared room">Shared Room</option>
                    <option value="Hotel room">Hotel Room</option>
                  </select>
                </div>

                {/* Min Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">
                    Minimum Rating: <span className="text-accent-primary">⭐ {minRating}</span>
                  </label>
                  <input
                    type="range"
                    min="0" max="5" step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Minimum Nights */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Minimum Nights</label>
                  <input
                    type="number"
                    min="1" max="20"
                    value={minNights}
                    onChange={handleMinNightsChange}
                    className={`input-glass w-full text-sm ${minNightsError ? 'border-red-500' : ''}`}
                  />
                  {minNightsError && <p className="text-xs text-red-500">{minNightsError}</p>}
                </div>

                {/* Reset */}
                <button onClick={handleReset} className="btn-secondary w-full text-sm">
                  Reset Filters
                </button>
              </div>
            </div>

            {/* ── Listings Grid ── */}
            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>

              {/* Loading state */}
              {loading && (
                <div className="card-glass p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Star className="w-6 h-6 text-accent-primary" />
                  </div>
                  <p className="text-muted">Loading listings from AI...</p>
                </div>
              )}

              {/* Error state */}
              {apiError && !loading && (
                <div className="card-glass p-12 text-center">
                  <p className="text-red-400">{apiError}</p>
                </div>
              )}

              {/* Results */}
              {!loading && !apiError && (
                <>
                  <div className="mb-6">
                    <p className="text-muted">
                      Showing <span className="text-accent-primary font-semibold">{filtered.length}</span> properties
                    </p>
                  </div>

                  {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filtered.map((property, index) => (
                        <div
                          key={index}
                          className="group card-glass overflow-hidden hover:border-accent-primary/50 transition cursor-pointer"
                        >
                          {/* Header band with city */}
                          <div className="h-12 bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 flex items-center px-4">
                            <div className="flex items-center gap-2 text-sm text-white">
                              <MapPin className="w-4 h-4" />
                              <span className="capitalize font-medium">{property.city}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            <h3 className="font-semibold text-text group-hover:text-accent-primary transition line-clamp-1">
                              {property.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-text font-medium">{property.rating}</span>
                              <span className="text-muted">({property.reviews ?? 'N/A'} reviews)</span>
                            </div>

                            {/* Room Type */}
                            <p className="text-xs text-accent-secondary">{property.room_type}</p>

                            {/* Capacity */}
                            <div className="flex gap-3 text-xs text-muted">
                              <span>👥 {property.accommodates} guests</span>
                              <span>🛏️ {property.bedrooms} bed</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 pt-2 border-t border-white/5">
                              <span className="text-2xl font-bold text-text">€{property.price}</span>
                              <span className="text-muted">/night</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="card-glass p-12 text-center">
                      <p className="text-muted text-lg">No properties match your filters. Try adjusting your criteria.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Listings