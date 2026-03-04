# MyHousing Frontend

A complete React frontend for the MyHousing Laravel backend with full authentication flows.

## Features

- ✅ User Registration with email verification
- ✅ Login/Logout with both token-based and Sanctum cookie-based auth
- ✅ Email Verification (link-based and resend functionality)
- ✅ Forgot Password flow
- ✅ Reset Password with token
- ✅ Protected Dashboard
- ✅ Form validation with react-hook-form
- ✅ Clean, responsive Tailwind UI
- ✅ Error handling and loading states

## Tech Stack

- **Vite** - Next generation frontend tooling
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **react-hook-form** - Form validation
- **Tailwind CSS** - Styling
- **Zod** - Optional schema validation

## Quick Start

### Prerequisites

- Node.js 16+ installed
- Laravel backend running on `http://127.0.0.1:8000`

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

The `.env` file is already configured:

```
VITE_API_URL=http://127.0.0.1:8000
```

**If your backend runs on a different URL**, update the `VITE_API_URL` in `.env`:

```
VITE_API_URL=http://your-backend-url:8000
```

### Running the Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## API Endpoints Configuration

All API endpoints are centralized in `src/api/endpoints.js`. If your Laravel backend uses different endpoint paths, update them there:

```javascript
export const ENDPOINTS = {
  REGISTER: '/api/register',
  LOGIN: '/api/login',
  LOGOUT: '/api/logout',
  // ... etc
}
```

## Authentication Flow

### Token-Based Authentication (Recommended)

If your backend returns `access_token` or `token` in the login response:

1. Token is stored in `localStorage`
2. Automatically attached to all API requests via Authorization header
3. Persists across page refreshes
4. Cleared on logout or 401 response

### Sanctum Cookie-Based Authentication

If your backend uses Laravel Sanctum with cookies:

1. CSRF cookie is automatically requested before login
2. Axios configured with `withCredentials: true`
3. Session maintained via HTTP-only cookies
4. No token storage required

The app automatically detects which method your backend uses.

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── endpoints.js      # Centralized API endpoints
│   │   ├── client.js         # Axios instance with interceptors
│   │   └── auth.js           # Auth API functions
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state management
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Loader.jsx
│   │   └── Toast.jsx
│   ├── App.jsx               # Main router and app layout
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind directives
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env                      # Environment variables
```

## Usage

### Register
- Navigate to `/register`
- Fill in name, email, password, and confirm password
- On success, you'll be redirected to `/verify-email`

### Verify Email
- Check your email for the verification link
- Click the link to verify (or use the resend button)
- After verification, you can log in

### Login
- Navigate to `/login`
- Enter email and password
- On success, you'll be redirected to `/dashboard`

### Dashboard
- Protected route - redirects to login if not authenticated
- Shows user information
- Logout button in navbar

### Forgot Password
- Navigate to `/forgot-password`
- Enter your email
- Check your email for the reset link

### Reset Password
- Click the reset link in your email
- Enter your new password
- You'll be redirected to login

## Form Validation

The app uses `react-hook-form` with built-in validation:

- **Email**: Must be valid format
- **Password**: Minimum 8 characters
- **Password Confirmation**: Must match password
- **Name**: Required field

Optional: You can add Zod schema validation for stricter validation.

## Error Handling

- **API Errors**: Displayed as toast notifications
- **Validation Errors**: Shown inline with form fields
- **401 Unauthorized**: Automatically clears auth and redirects to login
- **Network Errors**: Handled gracefully with retry options

## Security Features

- ✅ Tokens stored in `localStorage` (secure for most apps)
- ✅ Bearer token authorization headers
- ✅ CSRF protection via Sanctum
- ✅ 401 response interceptor
- ✅ Protected routes with context-based auth state
- ✅ No sensitive data in localStorage except token

## Customization

### Styling

All styles use Tailwind CSS. Modify `tailwind.config.js` to customize colors, fonts, etc.

### API Base URL

Update `VITE_API_URL` in `.env` to match your backend URL.

### Endpoints

Edit `src/api/endpoints.js` if your backend routes differ.

### UI Components

All components are in `src/components/` and `src/pages/` - fully customizable.

## Troubleshooting

### "Database connection not configured" error
- Ensure your Laravel `.env` has correct database credentials
- It shouldn't affect the frontend, but your backend won't work

### CORS errors
- Ensure your Laravel backend allows requests from `http://localhost:5173`
- Update Laravel's `config/cors.php` to allow the frontend URL

### 404 pages on refresh
- Vite automatically handles this, but if issues persist, ensure Vite dev server is running

### Authentication not persisting
- Check browser console for localStorage permissions
- Ensure cookies are not disabled in browser settings
- Verify the token is being stored in localStorage

## Production Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder to your hosting (Vercel, Netlify, AWS S3, etc.)
3. Update `VITE_API_URL` environment variable to your production backend URL
4. Ensure CORS is configured on your backend for production domain

## License

MIT

## Support

For issues or questions, check the Laravel backend configuration and ensure all endpoints match the API layer setup.
