import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Loader from './components/Loader'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Main App Pages
import Home from './pages/Home'
import Listings from './pages/Listings'
import PricePredictor from './pages/PricePredictor'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

// App Router Component
const AppRouter = () => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return <Loader />
  }

  return (
    <Routes>
      {/* Default to login page, but redirect authenticated users to home */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      
      {/* Public Auth Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/listings"
        element={
          <ProtectedRoute>
            <Listings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/price-predictor"
        element={
          <ProtectedRoute>
            <PricePredictor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  )
}

export default App
