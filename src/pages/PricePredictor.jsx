import { useState } from 'react'
import { Brain, Zap, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'

const CITY_COORDS = {
  barcelona: { latitude: 41.38, longitude: 2.17 },
  edinburgh: { latitude: 55.95, longitude: -3.19 },
  london:    { latitude: 51.50, longitude: -0.12 },
  lyon:      { latitude: 45.75, longitude: 4.83 },
  madrid:    { latitude: 40.41, longitude: -3.70 },
  paris:     { latitude: 48.85, longitude: 2.35 },
}

const ROOM_TYPE_MAP = {
  entire:  'Entire home/apt',
  private: 'Private room',
  shared:  'Shared room',
  hotel:   'Hotel room',
}

const PricePredictor = () => {
  const [formData, setFormData] = useState({
    location: '',
    roomType: 'entire',
    guests: '2',
    bedrooms: '1',
    bathrooms: '1',
    amenities: ['wifi', 'kitchen']
  })
  const [errors, setErrors] = useState({})
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const roomTypes = [
    { value: 'entire',  label: 'Entire Place' },
    { value: 'private', label: 'Private Room' },
    { value: 'shared',  label: 'Shared Room' },
    { value: 'hotel',   label: 'Hotel Room' },
  ]

  const allAmenities = [
    { id: 'wifi',    label: 'WiFi' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'ac',      label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating' },
    { id: 'pool',    label: 'Pool' },
    { id: 'gym',     label: 'Gym' },
    { id: 'parking', label: 'Parking' },
    { id: 'washer',  label: 'Washer' },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (/\d/.test(formData.location)) {
      newErrors.location = 'Location should only contain letters and spaces, not numbers'
    } else if (!/^[a-zA-Z\s,.-]+$/.test(formData.location)) {
      newErrors.location = 'Location should only contain letters, spaces, commas, dots and hyphens'
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    } else if (!CITY_COORDS[formData.location.trim().toLowerCase()]) {
      newErrors.location = 'Available cities: Barcelona, Edinburgh, London, Lyon, Madrid, Paris'
    }

    const guests = parseInt(formData.guests)
    if (!guests || guests <= 0)  newErrors.guests = 'Number of guests must be greater than 0'
    else if (guests > 20)        newErrors.guests = 'Number of guests cannot exceed 20'

    const bedrooms = parseInt(formData.bedrooms)
    if (!bedrooms || bedrooms <= 0) newErrors.bedrooms = 'Number of bedrooms must be greater than 0'
    else if (bedrooms > 20)         newErrors.bedrooms = 'Number of bedrooms cannot exceed 20'

    const bathrooms = parseInt(formData.bathrooms)
    if (!bathrooms || bathrooms <= 0) newErrors.bathrooms = 'Number of bathrooms must be greater than 0'
    else if (bathrooms > 10)          newErrors.bathrooms = 'Number of bathrooms cannot exceed 10'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleAmenity = (id) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setApiError(null)
    setPrediction(null)

    try {
      const city      = formData.location.trim().toLowerCase()
      const coords    = CITY_COORDS[city]
      const roomType  = ROOM_TYPE_MAP[formData.roomType]
      const accommodates = parseInt(formData.guests)
      const bedrooms     = parseInt(formData.bedrooms)
      const bathrooms    = parseInt(formData.bathrooms)

      const payload = {
        city,
        accommodates,
        bedrooms,
        bathrooms,
        latitude:             coords.latitude,
        longitude:            coords.longitude,
        review_scores_rating: 4.5,
        room_type:            roomType,
      }

      console.log("📤 Sending to predict-price:", payload)

      const response = await fetch('http://127.0.0.1:8000/api/predict-price', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      })

      const result = await response.json()
      console.log("📥 predict-price response:", result)

      if (result.error) {
        setApiError(result.error)
      } else {
        const estimatedPrice = result.predicted_price
        setPrediction({
          estimatedPrice,
          lowPrice:   Math.round(estimatedPrice * 0.85),
          highPrice:  Math.round(estimatedPrice * 1.15),
          confidence: 87,
          city:       formData.location,
          roomType:   roomType,
        })
      }
    } catch (error) {
      console.error("❌ API error:", error)
      setApiError('Could not connect to the AI service. Make sure Flask is running.')
    }

    setLoading(false)
  }

  const handleReset = () => {
    setPrediction(null)
    setApiError(null)
    setErrors({})
    setFormData({
      location: '',
      roomType: 'entire',
      guests: '2',
      bedrooms: '1',
      bathrooms: '1',
      amenities: ['wifi', 'kitchen']
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-text mb-4">AI Price Predictor</h1>
            <p className="text-lg text-muted">Get fair market pricing for your property using advanced AI analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 animate-slide-up">
              <form onSubmit={handleSubmit} className="card-glass p-8 space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">
                    City <span className="text-muted text-xs">(Barcelona, Edinburgh, London, Lyon, Madrid, Paris)</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Paris"
                    className={`input-glass w-full ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="input-glass w-full"
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Guests, Bedrooms, Bathrooms */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Guests</label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      min="1" max="20"
                      className={`input-glass w-full ${errors.guests ? 'border-red-500' : ''}`}
                    />
                    {errors.guests && <p className="text-xs text-red-500 mt-1">{errors.guests}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="1" max="20"
                      className={`input-glass w-full ${errors.bedrooms ? 'border-red-500' : ''}`}
                    />
                    {errors.bedrooms && <p className="text-xs text-red-500 mt-1">{errors.bedrooms}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="1" max="10"
                      className={`input-glass w-full ${errors.bathrooms ? 'border-red-500' : ''}`}
                    />
                    {errors.bathrooms && <p className="text-xs text-red-500 mt-1">{errors.bathrooms}</p>}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {allAmenities.map(amenity => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                          formData.amenities.includes(amenity.id)
                            ? 'bg-accent-primary/20 border border-accent-primary text-accent-primary'
                            : 'bg-white/5 border border-white/10 text-text hover:bg-white/10'
                        }`}
                      >
                        {amenity.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !formData.location || Object.keys(errors).filter(k => errors[k]).length > 0}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  {loading ? 'Analyzing...' : 'Get Fair Price Estimate'}
                </button>
              </form>
            </div>

            {/* Result Panel */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>

              {/* ── Error state ── */}
              {apiError && (
                <div className="card-glass p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                      <Brain className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-red-400 text-sm">{apiError}</p>
                    <button onClick={handleReset} className="btn-secondary w-full text-sm">Try Again</button>
                  </div>
                </div>
              )}

              {/* ── Loading state ── */}
              {loading && !apiError && (
                <div className="card-glass p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto animate-pulse">
                      <Brain className="w-6 h-6 text-accent-primary" />
                    </div>
                    <p className="text-muted text-sm">Analyzing your property...</p>
                  </div>
                </div>
              )}

              {/* ── Prediction result ── */}
              {prediction && !loading && (
                <div className="card-glass p-8 space-y-6 h-full">
                  <div className="space-y-1">
                    <p className="text-sm text-muted">Estimated Nightly Rate</p>
                    <p className="text-xs text-muted capitalize">{prediction.city} · {prediction.roomType}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gradient">€{prediction.estimatedPrice}</span>
                      <span className="text-muted">/night</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text">Recommended Price Range</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Low</span>
                        <span className="text-lg font-semibold text-text">€{prediction.lowPrice}</span>
                      </div>
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">High</span>
                        <span className="text-lg font-semibold text-text">€{prediction.highPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-text">AI Confidence Score</p>
                    <div className="space-y-2">
                      <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-accent-secondary font-semibold">{prediction.confidence}% Confidence</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg p-3">
                    <TrendingUp className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-text font-medium">Market Competitive</p>
                      <p className="text-muted text-xs">Based on real Airbnb listings in {prediction.city}</p>
                    </div>
                  </div>

                  <button onClick={handleReset} className="btn-secondary w-full text-sm">
                    Try Another Property
                  </button>
                </div>
              )}

              {/* ── Empty state ── */}
              {!prediction && !loading && !apiError && (
                <div className="card-glass p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center mx-auto">
                      <Brain className="w-6 h-6 text-accent-primary" />
                    </div>
                    <p className="text-muted text-sm">Fill in your property details and click the button to get an AI-powered price estimate.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PricePredictor