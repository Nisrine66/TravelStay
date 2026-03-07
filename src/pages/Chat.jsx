import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m TravelStay AI, your personal travel recommendation assistant. How can I help you find the perfect accommodation today?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response - replace with actual AI model integration
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I\'m analyzing your request and will provide personalized recommendations based on your preferences. This is where your AI model will be integrated to give travel recommendations.'
      }
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-card">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Chat with TravelStay</h1>
          <p className="text-muted">Get personalized travel recommendations from our AI assistant</p>
        </div>

        {/* Chat Container */}
        <div className="card-glass p-6 h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-accent-primary text-white'
                      : 'bg-dark-surface/50 text-text border border-white/10'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
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
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about travel recommendations, properties, or destinations..."
              className="flex-1 input-glass"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="btn-primary flex items-center gap-2 px-4"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            💡 Tip: Ask me about specific destinations, property types, price ranges, or travel recommendations!
          </p>
        </div>
      </main>
    </div>
  )
}

export default Chat
