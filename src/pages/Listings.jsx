import { useState, useEffect } from 'react'
import { Star, MapPin, Sliders } from 'lucide-react'
import Navbar from '../components/Navbar'

const Listings = () => {
  const [properties, setProperties] = useState([])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [roomType, setRoomType] = useState('all')
  const [minNights, setMinNights] = useState(0)

  useEffect(() => {
    // Mock data - would be fetched from API
    setProperties([
      {
        id: 1,
        title: 'Cozy Beach Bungalow',
        location: 'Bali, Indonesia',
        rating: 4.9,
        reviews: 234,
        price: 85,
        roomType: 'Entire bungalow',
        minNights: 3,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop'
      },
      {
        id: 2,
        title: 'Modern City Apartment',
        location: 'New York, USA',
        rating: 4.8,
        reviews: 512,
        price: 150,
        roomType: 'Entire apartment',
        minNights: 2,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
      },
      {
        id: 3,
        title: 'Mountain Cabin Retreat',
        location: 'Colorado, USA',
        rating: 4.9,
        reviews: 189,
        price: 120,
        roomType: 'Entire cabin',
        minNights: 2,
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=300&fit=crop'
      },
      {
        id: 4,
        title: 'Parisian Studio',
        location: 'Paris, France',
        rating: 4.7,
        reviews: 456,
        price: 95,
        roomType: 'Entire studio',
        minNights: 3,
        image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f5d?w=500&h=300&fit=crop'
      },
      {
        id: 5,
        title: 'Tokyo Modern Home',
        location: 'Tokyo, Japan',
        rating: 4.8,
        reviews: 278,
        price: 110,
        roomType: 'Entire apartment',
        minNights: 1,
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=300&fit=crop'
      },
      {
        id: 6,
        title: 'Barcelona Loft',
        location: 'Barcelona, Spain',
        rating: 4.6,
        reviews: 345,
        price: 105,
        roomType: 'Entire loft',
        minNights: 2,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
      },
      {
        id: 7,
        title: 'Bangkok Penthouse',
        location: 'Bangkok, Thailand',
        rating: 4.9,
        reviews: 412,
        price: 75,
        roomType: 'Entire penthouse',
        minNights: 1,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop'
      },
      {
        id: 8,
        title: 'Sydney Beach House',
        location: 'Sydney, Australia',
        rating: 4.7,
        reviews: 221,
        price: 145,
        roomType: 'Entire house',
        minNights: 3,
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=300&fit=crop'
      }
    ])
  }, [])

  const filteredProperties = properties.filter((prop) => {
    const priceMatch = prop.price >= priceRange[0] && prop.price <= priceRange[1]
    const roomMatch = roomType === 'all' || prop.roomType.toLowerCase().includes(roomType.toLowerCase())
    const nightsMatch = prop.minNights <= minNights || minNights === 0
    return priceMatch && roomMatch && nightsMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-text mb-8 animate-fade-in">Find Your Perfect Stay</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters */}
            <div className="animate-slide-up">
              <div className="card-glass p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-bold text-text">Filters</h2>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent-primary" />
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-dark-hover rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="input-glass w-full text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="cabin">Cabin</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                {/* Minimum Nights */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text">Minimum Nights</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={minNights}
                    onChange={(e) => setMinNights(parseInt(e.target.value))}
                    className="input-glass w-full text-sm"
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setPriceRange([0, 300])
                    setRoomType('all')
                    setMinNights(0)
                  }}
                  className="btn-secondary w-full text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6">
                <p className="text-muted">
                  Showing <span className="text-accent-primary font-semibold">{filteredProperties.length}</span> properties
                </p>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      className="group card-glass overflow-hidden hover:border-accent-primary/50 transition cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-text group-hover:text-accent-primary transition">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <MapPin className="w-4 h-4" />
                          {property.location}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-text font-medium">{property.rating}</span>
                          <span className="text-muted">({property.reviews})</span>
                        </div>

                        {/* Room Type */}
                        <p className="text-xs text-accent-secondary">{property.roomType}</p>

                        {/* Min Nights */}
                        <p className="text-xs text-muted">Minimum {property.minNights} night(s)</p>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 pt-2 border-t border-white/5">
                          <span className="text-2xl font-bold text-text">${property.price}</span>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Listings
