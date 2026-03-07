import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Users, Zap, Home as HomeIcon, Brain, MessageSquare } from 'lucide-react'
import Navbar from '../components/Navbar'

const Home = () => {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    // Mock property data
    setProperties([
      {
        id: 1,
        title: 'Cozy Beach Bungalow',
        location: 'Bali, Indonesia',
        comfortScore: 95,
        rating: 4.9,
        reviews: 234,
        price: 85,
        roomType: 'Entire bungalow',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop'
      },
      {
        id: 2,
        title: 'Modern City Apartment',
        location: 'New York, USA',
        comfortScore: 88,
        rating: 4.8,
        reviews: 512,
        price: 150,
        roomType: 'Entire apartment',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
      },
      {
        id: 3,
        title: 'Mountain Cabin Retreat',
        location: 'Colorado, USA',
        comfortScore: 92,
        rating: 4.9,
        reviews: 189,
        price: 120,
        roomType: 'Entire cabin',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&h=300&fit=crop'
      },
      {
        id: 4,
        title: 'Parisian Studio',
        location: 'Paris, France',
        comfortScore: 87,
        rating: 4.7,
        reviews: 456,
        price: 95,
        roomType: 'Entire studio',
        image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f5d?w=500&h=300&fit=crop'
      }
    ])
  }, [])

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Price Predictor',
      description: 'Get fair market prices for your property using advanced AI analysis'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Smart Matching',
      description: 'Find the perfect guests that match your property'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Bookings',
      description: 'Seamless booking experience for your guests'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-4">
                Welcome to <span className="text-gradient">aTravelStay</span>
              </h1>
              <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
                Discover amazing properties and get fair prices with AI-powered insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/listings"
                  className="btn-primary text-center"
                >
                  Browse Listings
                </Link>
                <Link
                  to="/price-predictor"
                  className="btn-secondary text-center"
                >
                  Predict Price
                </Link>
                <Link
                  to="/chat"
                  className="btn-accent text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with TravelStay
                </Link>
              </div>
            </div>

            {/* Recommended Properties */}
            <div className="mb-16 animate-slide-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-8">Recommended for You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((property) => (
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
                      {/* Comfort Score Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-br from-accent-primary to-accent-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ✨ {property.comfortScore}%
                      </div>
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

                      {/* Price */}
                      <div className="flex items-baseline gap-1 pt-2 border-t border-white/5">
                        <span className="text-2xl font-bold text-text">${property.price}</span>
                        <span className="text-muted">/night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-8">Why Choose aTravelStay</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="card-glass p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary text-white flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-text">{feature.title}</h3>
                    <p className="text-muted text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-dark-surface/50 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-text mb-4">About aTravelStay</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-accent-primary transition">Our Story</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Careers</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-accent-primary transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Contact Us</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Safety</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-4">Hosting</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-accent-primary transition">Start Hosting</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Guidelines</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li><a href="#" className="hover:text-accent-primary transition">Terms</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-accent-primary transition">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center text-sm text-muted">
              <p>&copy; 2026 aTravelStay. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Home
