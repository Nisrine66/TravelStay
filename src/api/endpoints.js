/**
 * Centralized API Endpoints Configuration
 * Modify these if your backend routes differ from standard Laravel Fortify/Sanctum
 */

export const ENDPOINTS = {
  // Authentication
  REGISTER: '/api/register',
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  ME: '/api/user',

  // Profile
  PROFILE: '/api/profile',
  PROFILE_PREFERENCES: '/api/profile/preferences',
  PROFILE_ACCOUNT: '/api/profile/account',
  PROFILE_PASSWORD: '/api/profile/password',

  // Email Verification
  EMAIL_VERIFY: '/api/email/verify',
  VERIFICATION_NOTIFICATION: '/api/email/verification-notification',

  // Password Reset
  FORGOT_PASSWORD: '/api/forgot-password',
  RESET_PASSWORD: '/api/reset-password',

  // Sanctum (if using cookie-based auth)
  SANCTUM_CSRF: '/sanctum/csrf-cookie'
}

export default ENDPOINTS
