import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

const FLOWS = {
  start: {
    message: "Hello! I'm TravelStay AI 👋 What can I help you with today?",
    options: [
      { label: "💰 Estimate a price", next: 'price_city' },
      { label: "🏠 Find a listing", next: 'recommend_price' },
      { label: "🌍 Discover destinations", next: 'destination_city' },
    ]
  },
  // Price flow
  price_city: { message: "Which city are you interested in?", field: 'city', next: 'price_accommodates' },
  price_accommodates: { message: "How many guests?", field: 'accommodates', next: 'price_bedrooms' },
  price_bedrooms: { message: "How many bedrooms do you need?", field: 'bedrooms', next: 'price_bathrooms' },
  price_bathrooms: { message: "How many bathrooms?", field: 'bathrooms', next: 'price_submit' },
  // Recommend flow
  recommend_price: { message: "What's your budget per night (€)?", field: 'price', next: 'recommend_accommodates' },
  recommend_accommodates: { message: "How many guests?", field: 'accommodates', next: 'recommend_bedrooms' },
  recommend_bedrooms: { message: "How many bedrooms?", field: 'bedrooms', next: 'recommend_bathrooms' },
  recommend_bathrooms: { message: "How many bathrooms?", field: 'bathrooms', next: 'recommend_submit' },
  // Destination flow
  destination_city: { message: "Which city do you currently like?", field: 'city', next: 'destination_submit' },
}

const CITY_COORDS = {
  barcelona: { latitude: 41.38, longitude: 2.17 },
  edinburgh: { latitude: 55.95, longitude: -3.19 },
  london:    { latitude: 51.50, longitude: -0.12 },
  lyon:      { latitude: 45.75, longitude: 4.83 },
  madrid:    { latitude: 40.41, longitude: -3.70 },
  paris:     { latitude: 48.85, longitude: 2.35 },
}

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState('start')
  const [userData, setUserData] = useState({})
  const bottomRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Start the conversation
  useEffect(() => {
    addBotMessage(FLOWS.start.message, FLOWS.start.options)
  }, [])

  const addBotMessage = (content, options = null) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content,
      options
    }])
  }

  const addUserMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content
    }])
  }

  // User clicks an option button
  const handleOption = (option) => {
    addUserMessage(option.label)
    setStep(option.next)
    setTimeout(() => {
      addBotMessage(FLOWS[option.next].message)
    }, 500)
  }

  // User types a text answer
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const value = inputMessage.trim()
    addUserMessage(value)
    setInputMessage('')

    const currentFlow = FLOWS[step]
    const newUserData = { ...userData, [currentFlow.field]: value }
    setUserData(newUserData)

    const nextStep = currentFlow.next

    if (nextStep.endsWith('_submit')) {
      await handleSubmit(nextStep, newUserData)
    } else {
      setStep(nextStep)
      setTimeout(() => {
        addBotMessage(FLOWS[nextStep].message)
      }, 500)
    }
  }

  const handleSubmit = async (submitStep, data) => {
    setIsLoading(true)

    try {
      let botContent = ''

      if (submitStep === 'price_submit') {
        const city = data.city?.toLowerCase() || 'paris'
        const coords = CITY_COORDS[city] || null

        if (!coords) {
          addBotMessage(`Sorry, I only have data for: Barcelona, Edinburgh, London, Lyon, Madrid and Paris. Please try again! 🌍`)
          setTimeout(() => {
            setUserData({})
            setStep('start')
            addBotMessage("Is there anything else I can help you with?", FLOWS.start.options)
          }, 1000)
          setIsLoading(false)
          return
        }

        const accommodates = parseInt(data.accommodates) || 2
        const bedrooms = parseInt(data.bedrooms) || 1
        const bathrooms = parseInt(data.bathrooms) || 1

        const response = await fetch('http://127.0.0.1:8000/api/predict-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price: 150,  // average price as reference
            accommodates,
            bedrooms,
            bathrooms,
            latitude: coords.latitude,
            longitude: coords.longitude,
            review_scores_rating: 4.5,
            room_type: 'Entire home/apt'
          })
        })
        const result = await response.json()
        botContent = `Based on your preferences in ${data.city}, the estimated price is €${result.predicted_price} per night! 🏠`
      } else if (submitStep === 'recommend_submit') {
        const price = parseFloat(data.price) || 100
        const accommodates = parseInt(data.accommodates) || 2
        const bedrooms = parseInt(data.bedrooms) || 1
        const bathrooms = parseInt(data.bathrooms) || 1

        const response = await fetch('http://127.0.0.1:8000/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price,
            accommodates,
            bedrooms,
            bathrooms,
            review_scores_rating: 4.5,
            comfort_score: bedrooms + bathrooms,
            price_per_person: price / accommodates
          })
        })
        const result = await response.json()
        const listingsList = result.listings.map((l, i) =>
          `${i + 1}. €${l.price}/night · ${l.bedrooms} bed · ${l.bathrooms} bath · ${l.accommodates} guests · ⭐${l.rating}`
        ).join('\n')
        botContent = `Here are 5 listings that match your preferences:\n\n${listingsList}`

      } else if (submitStep === 'destination_submit') {
        const response = await fetch('http://127.0.0.1:8000/api/destination', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: data.city })
        })
        const result = await response.json()
        if (result.similar_cities && result.similar_cities.length > 0) {
          botContent = `Since you like ${data.city}, you might also enjoy: ${result.similar_cities.join(', ')}! 🌍`
        } else {
          botContent = `${data.city} is unique! It's in its own category of destinations.`
        }
      }

      addBotMessage(botContent)

      // Ask if user wants to continue
      setTimeout(() => {
        setUserData({})
        setStep('start')
        addBotMessage("Is there anything else I can help you with?", FLOWS.start.options)
      }, 1000)

    } catch (error) {
      addBotMessage('Sorry, I could not connect to the AI service. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Chat with TravelStay</h1>
          <p className="text-muted">Get personalized travel recommendations from our AI assistant</p>
        </div>

        <div className="card-glass p-6 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[70%] flex flex-col gap-2`}>
                  <div className={`p-3 rounded-2xl ${message.type === 'user' ? 'bg-accent-primary text-white' : 'bg-dark-surface/50 text-text border border-white/10'}`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  {/* Option buttons */}
                  {message.options && (
                    <div className="flex flex-col gap-2">
                      {message.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleOption(option)}
                          className="text-left px-4 py-2 rounded-xl bg-accent-primary/20 border border-accent-primary/30 text-text text-sm hover:bg-accent-primary/40 transition-all"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-dark-surface/50 text-text border border-white/10 p-3 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 input-glass"
              disabled={isLoading || step === 'start'}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim() || step === 'start'}
              className="btn-primary flex items-center gap-2 px-4"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            💡 Tip: Choose an option above to get started!
          </p>
        </div>
      </main>
    </div>
  )
}

export default Chat