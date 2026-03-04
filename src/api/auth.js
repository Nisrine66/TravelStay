import client from './client'
import { ENDPOINTS } from './endpoints'

/**
 * Auth API Functions
 * These handle communication with the Laravel backend
 */

// Register a new user
export const register = async (data) => {
  try {
    const response = await client.post(ENDPOINTS.REGISTER, {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' }
  }
}

// Login user
export const login = async (email, password) => {
  try {
    console.log('API login attempt for:', email)
    
    // Direct login without CSRF cookie for token-based auth
    const response = await client.post(ENDPOINTS.LOGIN, {
      email,
      password
    })

    console.log('API login response:', response.data)

    // Handle both token-based and cookie-based responses
    if (response.data.access_token || response.data.token) {
      localStorage.setItem('auth_token', response.data.access_token || response.data.token)
    }

    return response.data
  } catch (error) {
    console.error('API login error:', error.response?.data || error)
    throw error.response?.data || { message: 'Login failed' }
  }
}

// Logout user
export const logout = async () => {
  try {
    await client.post(ENDPOINTS.LOGOUT)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  } catch (error) {
    // Clear auth state even if logout fails
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    throw error.response?.data || { message: 'Logout failed' }
  }
}

// Get current user
export const me = async () => {
  try {
    const response = await client.get(ENDPOINTS.ME)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' }
  }
}

// Resend email verification
export const resendVerification = async () => {
  try {
    const response = await client.post(ENDPOINTS.VERIFICATION_NOTIFICATION)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend verification email' }
  }
}

// Request password reset email
export const forgotPassword = async (email) => {
  try {
    const response = await client.post(ENDPOINTS.FORGOT_PASSWORD, { email })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send reset email' }
  }
}

// Reset password with token
export const resetPassword = async (data) => {
  try {
    const response = await client.post(ENDPOINTS.RESET_PASSWORD, {
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      token: data.token
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' }
  }
}

// Verify email with token (if using token-based verification)
export const verifyEmail = async (token) => {
  try {
    const response = await client.get(ENDPOINTS.EMAIL_VERIFY, {
      params: { token }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify email' }
  }
}

export default {
  register,
  login,
  logout,
  me,
  resendVerification,
  forgotPassword,
  resetPassword,
  verifyEmail
}
