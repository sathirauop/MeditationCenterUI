# Meditation Center UI

A Next.js frontend application for the Isipathana International Meditation Center, built with modern best practices for security and user experience.

## Features

- 🔐 **Secure Authentication** - Login and registration with form validation
- 🎨 **CSS Modules + Sass** - Component-scoped styling with powerful Sass features
- 🛡️ **Security Headers** - Configured with industry-standard security headers
- 📱 **Responsive Design** - Mobile-first approach with clean, accessible UI
- ✨ **Form Validation** - Client-side validation using React Hook Form + Zod
- 🚀 **Fast Development** - Next.js 15 with Turbopack for instant feedback
- 🎯 **Type Safety** - Zod schemas for runtime type validation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Package Manager**: pnpm
- **Styling**: CSS Modules + Sass/SCSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Authentication**: Custom context-based auth with localStorage tokens

## Prerequisites

- Node.js 18+
- pnpm (install with `npm install -g pnpm`)
- Backend API running at `https://isipathana-meditation-center.onrender.com`

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Production Backend (default)
NEXT_PUBLIC_API_URL=https://isipathana-meditation-center.onrender.com/api

# For local development, use:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
meditation-center-ui/
├── app/                      # Next.js App Router pages
│   ├── login/               # Login page
│   │   ├── page.js
│   │   └── login.module.scss
│   ├── register/            # Registration page
│   │   ├── page.js
│   │   └── register.module.scss
│   ├── layout.js            # Root layout with AuthProvider
│   ├── page.js              # Home page (protected)
│   └── page.module.scss
├── lib/                     # Utilities and helpers
│   ├── api.js              # API client with fetch wrapper
│   └── auth-context.js     # Authentication context provider
├── styles/                  # Global styles
│   ├── globals.scss        # Global CSS reset and utilities
│   ├── _variables.scss     # Sass variables (colors, spacing, etc.)
│   └── _mixins.scss        # Reusable Sass mixins
├── next.config.js          # Next.js configuration with security headers
├── jsconfig.json           # JavaScript configuration for path aliases
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Pages

### Login (`/login`)
- Email and password authentication
- Form validation with error messages
- Redirects to home page on success
- Link to registration page

### Register (`/register`)
- User registration with name, email, and password
- Strong password validation (min 8 chars, uppercase, lowercase, numbers)
- Password confirmation matching
- Success message with redirect
- Link to login page

### Home (`/`)
- Protected route (requires authentication)
- User welcome message with account info
- Quick links to upcoming features
- Logout functionality

## Security Features

### Security Headers
Configured in `next.config.js`:
- `Strict-Transport-Security` - Force HTTPS
- `X-Frame-Options` - Prevent clickjacking
- `X-Content-Type-Options` - Prevent MIME sniffing
- `X-XSS-Protection` - XSS protection
- `Referrer-Policy` - Control referrer information
- `Permissions-Policy` - Restrict browser features

### Form Security
- Client-side validation with Zod schemas
- Password strength requirements
- CSRF protection via token-based authentication
- Input sanitization

### Authentication
- Token-based authentication with localStorage
- Automatic token validation on page load
- Protected routes with redirects
- Secure logout with token cleanup

## API Integration

The application expects the following API endpoints from the backend:

### Auth Endpoints
- `POST /api/auth/login` - User login
  ```json
  Request: { "email": "user@example.com", "password": "password123" }
  Response: { "token": "jwt-token", "user": { "name": "...", "email": "...", "role": "..." } }
  ```

- `POST /api/auth/register` - User registration
  ```json
  Request: { "name": "John Doe", "email": "user@example.com", "password": "password123" }
  Response: { "token": "jwt-token", "user": { "name": "...", "email": "...", "role": "..." } }
  ```

- `GET /api/auth/me` - Get current user
  ```json
  Headers: { "Authorization": "Bearer jwt-token" }
  Response: { "name": "...", "email": "...", "role": "..." }
  ```

- `POST /api/auth/logout` - User logout

## Theme Customization

The application uses a teal and gold color scheme inspired by meditation aesthetics. Customize colors in `styles/_variables.scss`:

```scss
$primary-teal: #0d9488;
$accent-gold: #d97706;
```

All spacing, typography, and design tokens are centralized in `_variables.scss` for easy customization.

## Development Best Practices

### CSS Modules
- Each component has its own `.module.scss` file
- Styles are scoped to the component (no global conflicts)
- Use Sass variables and mixins from `styles/`

### Form Handling
- Use React Hook Form for form management
- Define Zod schemas for validation
- Show user-friendly error messages

### API Calls
- Use the `api.js` helper functions
- Handle errors gracefully with try-catch
- Show loading states during API calls

### Authentication
- Use the `useAuth()` hook to access auth state
- Check `isAuthenticated` before showing protected content
- Always handle loading states

## Troubleshooting

### Port Already in Use
If port 3000 is in use, specify a different port:
```bash
pnpm dev -- -p 3001
```

### API Connection Issues
1. Ensure the backend is accessible at `https://isipathana-meditation-center.onrender.com`
2. **IMPORTANT**: Configure CORS in the Spring Boot backend to allow `http://localhost:3000`
   - Add to `application.properties`:
   ```properties
   # CORS Configuration
   spring.web.cors.allowed-origins=http://localhost:3000,https://your-production-domain.com
   spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
   spring.web.cors.allowed-headers=*
   spring.web.cors.allow-credentials=true
   ```
   - Or use `@CrossOrigin` annotation in your Spring controllers
3. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
4. Check browser console for CORS errors

### Sass Compilation Errors
- Check import paths in `.scss` files
- Ensure `sass` package is installed
- Verify no syntax errors in Sass files

## CORS Configuration (Backend Required)

**IMPORTANT**: The backend must allow requests from `http://localhost:3000` for the frontend to work.

### Spring Boot CORS Configuration

Add this configuration class to your Spring Boot project:

```java
package com.isipathana.meditationcenter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:3000",           // Local development
                    "https://your-frontend-domain.com" // Production (when deployed)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**Alternative**: Add `@CrossOrigin` to individual controllers:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // Your endpoints
}
```

## Next Steps

This is a starter template. Future enhancements could include:
- [ ] Meditation program browsing and booking
- [ ] Event calendar and registration
- [ ] Donation campaigns
- [ ] User profile management
- [ ] Bilingual support (English/Sinhala)
- [ ] Admin dashboard
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social authentication

## Contributing

When adding new features:
1. Create new pages in the `app/` directory
2. Use CSS Modules for component styles
3. Follow the existing Sass variable system
4. Add form validation with Zod
5. Update this README with new features

## License

Copyright © 2025 Isipathana International Meditation Center. All rights reserved.
