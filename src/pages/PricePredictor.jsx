import { useState } from 'react'
import { Brain, Zap, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'

const PricePredictor = () => {
  const [formData, setFormData] = useState({
    location: '',
    roomType: 'entire',
    guests: '2',
    bedrooms: '1',
    bathrooms: '1',
    amenities: ['wifi', 'kitchen']
  })
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const roomTypes = [
    { value: 'entire', label: 'Entire Place' },
    { value: 'private', label: 'Private Room' },
    { value: 'shared', label: 'Shared Room' }
  ]

  const allAmenities = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'heating', label: 'Heating' },
    { id: 'pool', label: 'Pool' },
    { id: 'gym', label: 'Gym' },
    { id: 'parking', label: 'Parking' },
    { id: 'washer', label: 'Washer' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const basePrice = {
        'entire': 120,
        'private': 60,
        'shared': 30
      }[formData.roomType]

      const guestMultiplier = Math.max(1, parseInt(formData.guests) / 2)
      const facilitiesBonus = formData.amenities.length * 5
      const estimatedPrice = Math.round(basePrice * guestMultiplier + facilitiesBonus)

      setPrediction({
        estimatedPrice,
        lowPrice: Math.round(estimatedPrice * 0.85),
        highPrice: Math.round(estimatedPrice * 1.15),
        confidence: 92
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      {/* Animated background */}
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
                  <label className="text-sm font-medium text-text">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, USA"
                    className="input-glass w-full"
                  />
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
                      min="1"
                      max="20"
                      className="input-glass w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      className="input-glass w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      className="input-glass w-full"
                    />
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.location}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  {loading ? 'Analyzing...' : 'Get Fair Price Estimate'}
                </button>
              </form>
            </div>

            {/* Prediction Result */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {prediction ? (
                <div className="card-glass p-8 space-y-6 h-full">
                  <div className="space-y-2">
                    <p className="text-sm text-muted">Estimated Nightly Rate</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gradient">${prediction.estimatedPrice}</span>
                      <span className="text-muted">/night</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text">Recommended Price Range</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">Low</span>
                        <span className="text-lg font-semibold text-text">${prediction.lowPrice}</span>
                      </div>
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted">High</span>
                        <span className="text-lg font-semibold text-text">${prediction.highPrice}</span>
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

                  {/* Info Cards */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg p-3">
                      <TrendingUp className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-text font-medium">Market Competitive</p>
                        <p className="text-muted text-xs">Price is 8% above average for your area</p>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setPrediction(null)
                      setFormData({
                        location: '',
                        roomType: 'entire',
                        guests: '2',
                        bedrooms: '1',
                        bathrooms: '1',
                        amenities: ['wifi', 'kitchen']
                      })
                    }}
                    className="btn-secondary w-full text-sm"
                  >
                    Try Another Property
                  </button>
                </div>
              ) : (
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
