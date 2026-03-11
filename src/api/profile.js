import client from './client'
import { ENDPOINTS } from './endpoints'

/**
 * Profile API Functions
 * These handle user profile operations with the Laravel backend
 */

// Get user profile with preferences
export const getProfile = async () => {
  try {
    const response = await client.get(ENDPOINTS.PROFILE)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' }
  }
}

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await client.put(ENDPOINTS.PROFILE, profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' }
  }
}

// Update user preferences
export const updatePreferences = async (preferences) => {
  try {
    const response = await client.put(ENDPOINTS.PROFILE_PREFERENCES, {
      favorite_destinations: preferences.favoriteDestinations,
      preferred_room_types: preferences.preferredRoomTypes,
      budget_min: preferences.budget[0],
      budget_max: preferences.budget[1],
      amenities: preferences.amenities
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update preferences' }
  }
}

// Update user account info (name, email)
export const updateAccount = async (accountData) => {
  try {
    const response = await client.put(ENDPOINTS.PROFILE_ACCOUNT, {
      name: accountData.name,
      email: accountData.email
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update account' }
  }
}

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await client.put(ENDPOINTS.PROFILE_PASSWORD, {
      current_password: passwordData.currentPassword,
      password: passwordData.password,
      password_confirmation: passwordData.passwordConfirmation
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' }
  }
}

export default {
  getProfile,
  updateProfile,
  updatePreferences,
  updateAccount,
  changePassword
}
