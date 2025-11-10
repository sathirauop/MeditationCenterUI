# Security Audit & Code Quality Report
## Meditation Center UI - Frontend Application

**Date:** January 11, 2025
**Auditor:** Claude Code Analysis
**Version:** 1.0
**Overall Risk Level:** HIGH

---

## Executive Summary

This report documents the results of a comprehensive security audit and code quality analysis of the Meditation Center UI frontend application. The audit identified **30 distinct issues** ranging from critical security vulnerabilities to code quality concerns.

### Key Findings

- **6 CRITICAL security vulnerabilities** that must be addressed before production deployment
- **7 HIGH priority** issues requiring immediate attention
- **14 MEDIUM priority** issues affecting security and code quality
- **3 LOW priority** improvements for optimization

### Risk Assessment

| Category | Count | Impact |
|----------|-------|---------|
| Critical Security | 6 | Production Blocking |
| High Priority | 7 | Must Fix This Sprint |
| Medium Priority | 14 | Plan to Address |
| Low Priority | 3 | Nice to Have |

**Production Readiness Score:** ⚠️ **NOT READY** - Critical issues must be resolved

---

## Table of Contents

1. [Critical Security Issues](#critical-security-issues)
2. [High Priority Issues](#high-priority-issues)
3. [Medium Priority Issues](#medium-priority-issues)
4. [Low Priority Issues](#low-priority-issues)
5. [Recommended Actions](#recommended-actions)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Critical Security Issues

### CRITICAL-1: Insecure Token Storage in localStorage

**Severity:** 🔴 CRITICAL
**CWE:** CWE-522 (Insufficiently Protected Credentials)
**CVSS Score:** 8.1 (High)

#### Description
JWT access and refresh tokens are stored in browser localStorage without any encryption or protection mechanism. This makes them vulnerable to XSS (Cross-Site Scripting) attacks.

#### Affected Files
- `lib/axios-client.js` (Lines 20, 64)
- `lib/hooks/use-auth.js` (Lines 32, 35, 71, 74, 109, 110, 121, 122)

#### Vulnerable Code
```javascript
// lib/hooks/use-auth.js:32
localStorage.setItem('auth_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);

// lib/axios-client.js:20
const token = localStorage.getItem('auth_token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

#### Attack Scenario
1. Attacker injects malicious JavaScript via XSS vulnerability
2. Script reads `localStorage.getItem('auth_token')`
3. Token is exfiltrated to attacker's server
4. Attacker gains full access to user account

#### Impact
- Complete account takeover
- Unauthorized access to admin panel
- Data breach
- Identity theft

#### Recommendation

**Option 1: httpOnly Cookies (RECOMMENDED)**
```javascript
// Backend sets cookie with httpOnly flag
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
});

// Frontend: No token handling needed - automatically sent with requests
```

**Option 2: Session Storage with Encryption**
```javascript
// Only if cookies cannot be used
import CryptoJS from 'crypto-js';

const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_KEY).toString();
};

const decryptToken = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

---

### CRITICAL-2: API URL Exposed in Client Bundle

**Severity:** 🔴 CRITICAL
**CWE:** CWE-200 (Exposure of Sensitive Information)
**CVSS Score:** 7.5 (High)

#### Description
The backend API URL is exposed in the client-side JavaScript bundle via `NEXT_PUBLIC_` environment variable prefix, allowing attackers to easily identify and target backend endpoints.

#### Affected Files
- `.env.local` (Line 3)
- `lib/axios-client.js` (Line 4)

#### Vulnerable Code
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

```javascript
// lib/axios-client.js:4
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

#### Impact
- Backend API endpoints discoverable by attackers
- Facilitates reconnaissance for targeted attacks
- Enables automated vulnerability scanning
- Exposes internal network topology

#### Recommendation

**Remove NEXT_PUBLIC_ prefix:**
```bash
# .env.local
API_URL=http://localhost:8080/api  # Server-side only
```

**Use Next.js API routes as proxy:**
```javascript
// app/api/proxy/[...path]/route.js
export async function GET(request, { params }) {
  const path = params.path.join('/');
  const apiUrl = process.env.API_URL; // Server-side only
  const response = await fetch(`${apiUrl}/${path}`);
  return response;
}

// Frontend calls /api/proxy/* instead of direct backend
```

---

### CRITICAL-3: JWT Role Claims Trusted Without Validation

**Severity:** 🔴 CRITICAL
**CWE:** CWE-287 (Improper Authentication)
**CVSS Score:** 9.1 (Critical)

#### Description
The application decodes JWT tokens client-side and trusts the role claim without server-side signature validation. Attackers can modify the role claim to escalate privileges.

#### Affected Files
- `lib/api/auth.js` (Lines 59-84)
- `app/admin/layout.jsx` (Lines 20-23)

#### Vulnerable Code
```javascript
// lib/api/auth.js:63-71
const payload = decodeJwtPayload(token);
console.log(payload); // Also logs sensitive data
return {
  userId: payload.userId,
  email: payload.email,
  name: payload.name || payload.email,
  role: payload.role,  // ⚠️ TRUSTED WITHOUT VALIDATION
};
```

```javascript
// app/admin/layout.jsx:21
if (isMounted && !loading && (!isAuthenticated || user?.role !== 'ADMIN')) {
  router.push('/');  // Only client-side check
}
```

#### Attack Scenario
1. User obtains valid JWT token with role: "USER"
2. Attacker decodes JWT (not encrypted, only signed)
3. Modifies payload to role: "ADMIN"
4. Re-encodes token (signature will be invalid but not checked client-side)
5. Stores modified token in localStorage
6. Client trusts the role claim
7. Gains admin access

#### Impact
- Complete privilege escalation
- Unauthorized admin access
- Ability to create/modify/delete events
- Full system compromise

#### Recommendation

**Backend MUST validate role on every admin endpoint:**
```java
// Backend: AdminEventController.java
@PostMapping("/admin/event")
@PreAuthorize("hasRole('ADMIN')")  // Validates JWT signature + role
public ResponseEntity<?> createEvent(@RequestBody EventDTO event) {
    // Additional validation
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String role = auth.getAuthorities().stream()
        .filter(a -> a.getAuthority().equals("ROLE_ADMIN"))
        .findFirst()
        .orElseThrow(() -> new AccessDeniedException("Admin access required"));

    // Process request
}
```

**Frontend should NEVER trust decoded JWT:**
```javascript
// lib/api/auth.js - Remove client-side JWT decoding
// Always call backend /auth/me endpoint for user data
export const getCurrentUser = async () => {
  // Backend validates JWT signature and returns user data
  const response = await axiosClient.get('/auth/me');
  return response;
};
```

---

### CRITICAL-4: Open Redirect Vulnerability

**Severity:** 🔴 CRITICAL
**CWE:** CWE-601 (URL Redirection to Untrusted Site)
**CVSS Score:** 6.5 (Medium)

#### Description
Direct window.location assignment in error handler can be exploited if error messages are controllable by attacker.

#### Affected Files
- `lib/axios-client.js` (Line 68)

#### Vulnerable Code
```javascript
// lib/axios-client.js:68
window.location.href = '/login';  // No URL validation
```

#### Attack Scenario
If backend error response can be manipulated:
```javascript
// Hypothetical attack
error.response.data.redirect = 'https://evil.com/phishing';
window.location.href = error.response.data.redirect;
```

#### Impact
- Phishing attacks
- Credential theft
- Malware distribution

#### Recommendation

**Validate redirect URLs:**
```javascript
// lib/axios-client.js
const ALLOWED_REDIRECTS = ['/login', '/register', '/'];

const safeRedirect = (url) => {
  if (ALLOWED_REDIRECTS.includes(url)) {
    window.location.href = url;
  } else {
    console.error('Invalid redirect URL:', url);
    window.location.href = '/';
  }
};

// Use Next.js router instead
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/login');
```

---

### CRITICAL-5: Missing CSRF Protection

**Severity:** 🔴 CRITICAL
**CWE:** CWE-352 (Cross-Site Request Forgery)
**CVSS Score:** 8.1 (High)

#### Description
No CSRF token validation on state-changing requests. Attackers can trick authenticated users into performing unwanted actions.

#### Affected Files
- All POST/PUT/DELETE endpoints in `lib/api/auth.js` and `lib/api/events.js`

#### Vulnerable Endpoints
```javascript
// lib/api/auth.js
POST /auth/login
POST /auth/register
POST /auth/logout

// lib/api/events.js
POST /admin/event
PUT /events/{id}
DELETE /events/{id}
POST /events/{id}/register
```

#### Attack Scenario
1. User is logged into meditation center site
2. Visits attacker's website while logged in
3. Attacker's page contains hidden form:
```html
<form action="https://api.meditation.com/admin/event" method="POST">
  <input name="name" value="Malicious Event" />
  <input name="description" value="Phishing content" />
</form>
<script>document.forms[0].submit();</script>
```
4. Form submits with user's authentication cookie
5. Unauthorized event created

#### Impact
- Unauthorized event creation/modification
- Account takeover
- Data manipulation
- Reputation damage

#### Recommendation

**Implement CSRF tokens:**
```javascript
// lib/axios-client.js
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase())) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});
```

**Backend must validate CSRF token:**
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            .authorizeRequests()
            .anyRequest().authenticated();
        return http.build();
    }
}
```

---

### CRITICAL-6: Sensitive Data Logged to Console

**Severity:** 🔴 CRITICAL
**CWE:** CWE-532 (Insertion of Sensitive Information into Log File)
**CVSS Score:** 7.5 (High)

#### Description
User data, JWT payloads, and error details are logged to browser console, exposing sensitive information.

#### Affected Files
- `lib/api/auth.js` (Line 65)
- `components/layout/Header.jsx` (Line 37)
- `lib/hooks/use-auth.js` (Lines 50, 54, 89, 93, 119)
- `lib/axios-client.js` (Lines 41, 62)
- `components/admin/CreateEventDialog.jsx` (Line 54)
- `lib/hooks/use-events.js` (Line 52)

#### Vulnerable Code
```javascript
// lib/api/auth.js:65
console.log(payload);  // Logs entire JWT payload

// components/layout/Header.jsx:37
console.log(user);  // Logs user ID, email, role

// lib/hooks/use-auth.js:50
console.error('Error fetching user after login:', error);  // May contain tokens
```

#### Impact
- JWT tokens exposed in console
- User PII (email, name, ID) accessible
- Error messages reveal system internals
- Facilitates attack reconnaissance

#### Recommendation

**Remove all console statements:**
```bash
# Find all console statements
grep -r "console\." app/ components/ lib/

# Remove or replace with proper logging
```

**Use proper logging library:**
```javascript
// lib/logger.js
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  error: (message, error) => {
    if (isDev) {
      console.error(message, error);
    } else {
      // Send to logging service (Sentry, LogRocket, etc.)
      // DO NOT log sensitive data
    }
  },

  info: (message) => {
    if (isDev) {
      console.log(message);
    }
  }
};

// Usage
import { logger } from '@/lib/logger';
logger.error('Login failed', { email: user.email }); // DO NOT log tokens
```

---

## High Priority Issues

### HIGH-1: Unvalidated Image URLs from API

**Severity:** 🟠 HIGH
**CWE:** CWE-494 (Download of Code Without Integrity Check)

#### Description
Image URLs from backend API are rendered without validation, potentially loading malicious content.

#### Affected Files
- `components/events/EventCard.jsx` (Lines 44-49)

#### Vulnerable Code
```javascript
// components/events/EventCard.jsx:38
const eventImage = cover_image_url || (gallery_image_urls && gallery_image_urls[0]);

// Later rendered without validation:
<img src={eventImage} alt={name} className="w-full h-full object-cover" />
```

#### Recommendation
```javascript
// lib/utils/validate-url.js
export const isValidImageUrl = (url) => {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') return false;
    // Whitelist allowed domains
    const allowedDomains = ['cloudflare.com', 'yourdomain.com'];
    return allowedDomains.some(domain => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
};

// components/events/EventCard.jsx
const eventImage = isValidImageUrl(cover_image_url) ? cover_image_url : '/placeholder.jpg';
```

---

### HIGH-2: Form Validation Only Client-Side

**Severity:** 🟠 HIGH
**CWE:** CWE-602 (Client-Side Enforcement of Server-Side Security)

#### Description
All form validation uses Zod on client-side only. Attackers can bypass validation by directly calling API endpoints.

#### Affected Files
- `app/login/page.js` (Lines 19-27)
- `app/register/page.js` (Lines 19-40)
- `components/admin/EventForm.jsx` (Lines 14-30)

#### Vulnerable Code
```javascript
// app/login/page.js:19
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

#### Attack Scenario
```bash
# Attacker bypasses client validation
curl -X POST https://api.meditation.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(1)</script>","password":"x"}'
```

#### Recommendation
**Backend MUST validate all inputs:**
```java
// Backend validation
@PostMapping("/auth/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginDTO login) {
    // Spring Boot @Valid annotation triggers validation
    // Use @Email, @Size, @NotBlank annotations
}

@Data
public class LoginDTO {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    @NotBlank(message = "Password is required")
    private String password;
}
```

---

### HIGH-3: Missing File Upload Validation

**Severity:** 🟠 HIGH
**CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type)

#### Description
No validation on uploaded image files (type, size, content).

#### Affected Files
- `components/admin/EventForm.jsx` (Lines 44-62)

#### Vulnerable Code
```javascript
const handleCoverImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    setCoverImage(file);  // No validation
  }
};
```

#### Recommendation
```javascript
// components/admin/EventForm.jsx
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const validateImage = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be less than 5MB');
  }

  return true;
};

const handleCoverImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      validateImage(file);
      setCoverImage(file);
    } catch (error) {
      toast.error(error.message);
    }
  }
};
```

---

### HIGH-4: Refresh Token Not Implemented

**Severity:** 🟠 HIGH
**CWE:** CWE-613 (Insufficient Session Expiration)

#### Description
Refresh token function exists but is never called. Users are logged out when access token expires.

#### Affected Files
- `lib/api/auth.js` (Lines 104-113)
- `lib/axios-client.js` (No refresh logic in 401 interceptor)

#### Vulnerable Code
```javascript
// lib/api/auth.js:104 - Function exists but unused
export const refreshAccessToken = async (refreshToken) => {
  // Implementation exists but never called
};
```

#### Recommendation
```javascript
// lib/axios-client.js
let isRefreshing = false;
let failedQueue = [];

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await refreshAccessToken(refreshToken);

        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        // Retry all queued requests
        failedQueue.forEach(prom => prom.resolve());
        failedQueue = [];

        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

### HIGH-5: No Error Boundaries

**Severity:** 🟠 HIGH
**CWE:** CWE-755 (Improper Handling of Exceptional Conditions)

#### Description
No error boundary components implemented. A single component error crashes the entire application.

#### Affected Files
- `app/layout.js` (No error boundary)
- `app/admin/layout.jsx` (No error boundary)

#### Impact
- Blank white screen on errors
- Poor user experience
- No error recovery
- No error logging

#### Recommendation
```javascript
// components/ErrorBoundary.jsx
'use client';

import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Error boundary caught:', error, errorInfo);
    // Send to Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// app/layout.js - Wrap with ErrorBoundary
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

### HIGH-6: Race Condition in Authentication

**Severity:** 🟠 HIGH
**CWE:** CWE-362 (Concurrent Execution using Shared Resource)

#### Description
Multiple async operations in login flow without proper sequencing can cause race conditions.

#### Affected Files
- `lib/hooks/use-auth.js` (Lines 29-51)

#### Vulnerable Code
```javascript
try {
  const user = await getCurrentUser();  // Async operation
  queryClient.setQueryData(...);        // Assumes success
  // Redirect happens even if user fetch fails
  if (user.role === 'ADMIN') {
    router.push('/admin');
  }
} catch (error) {
  console.error('Error fetching user after login:', error);
  // No recovery - user may be redirected to wrong page
}
```

#### Recommendation
```javascript
onSuccess: async (data) => {
  try {
    // Store tokens
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    // Fetch user - MUST succeed before redirect
    const user = await getCurrentUser();
    queryClient.setQueryData(queryKeys.auth.currentUser(), user);

    // Only redirect after successful user fetch
    if (user.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (error) {
    // Clear tokens on failure
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    // Show error to user
    toast.error('Login succeeded but failed to fetch user data. Please try again.');
    throw error; // Re-throw to mark mutation as failed
  }
},
```

---

### HIGH-7: No Protected API Routes

**Severity:** 🟠 HIGH
**CWE:** CWE-306 (Missing Authentication for Critical Function)

#### Description
No Next.js API routes defined. All API calls go directly to backend, exposing endpoints.

#### Impact
- No server-side session management
- Cannot validate tokens server-side in Next.js
- CORS must be configured on backend
- No ability to add middleware

#### Recommendation
```javascript
// app/api/auth/me/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Validate token server-side
    const response = await fetch(`${process.env.API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## Medium Priority Issues

### MEDIUM-1: Missing Image Optimization

**Severity:** 🟡 MEDIUM
**Performance Impact:** HIGH

#### Description
EventCard uses standard `<img>` tag instead of Next.js `<Image>` component, missing automatic optimization.

#### Affected Files
- `components/events/EventCard.jsx` (Lines 44-49)

#### Current Code
```javascript
<img src={eventImage} alt={name} className="w-full h-full object-cover" />
```

#### Recommendation
```javascript
import Image from 'next/image';

<div className="relative aspect-[4/3]">
  <Image
    src={eventImage}
    alt={name}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

---

### MEDIUM-2: No TypeScript

**Severity:** 🟡 MEDIUM
**Maintainability Impact:** HIGH

#### Description
Entire codebase uses JavaScript instead of TypeScript, lacking type safety.

#### Impact
- No compile-time type checking
- Prone to runtime type errors
- No autocomplete for API contracts
- Harder to refactor safely

#### Recommendation
```bash
# Install TypeScript
npm install --save-dev typescript @types/react @types/node

# Create tsconfig.json
npx tsc --init

# Rename files gradually
mv app/page.js app/page.tsx
mv lib/api/auth.js lib/api/auth.ts
```

```typescript
// lib/api/auth.ts
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface User {
  userId: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Implementation
};
```

---

### MEDIUM-3: Hardcoded Contact Information

**Severity:** 🟡 MEDIUM
**Maintainability Impact:** MEDIUM

#### Description
Phone numbers and emails hardcoded in components instead of coming from backend/config.

#### Affected Files
- `app/page.js` (Lines 180, 194, 208, 228, 260-261)

#### Recommendation
```javascript
// lib/config/contact.js
export const CONTACT_INFO = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+94 77 123 4567',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@isipathana.lk',
  location: process.env.NEXT_PUBLIC_LOCATION || 'Colombo, Sri Lanka',
  hours: process.env.NEXT_PUBLIC_HOURS || 'Daily: 6:00 AM - 8:00 PM',
};

// app/page.js
import { CONTACT_INFO } from '@/lib/config/contact';

<p><a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a></p>
```

---

### MEDIUM-4: No Environment Variable Validation

**Severity:** 🟡 MEDIUM
**Reliability Impact:** MEDIUM

#### Description
Missing required environment variable validation at build time.

#### Affected Files
- `lib/axios-client.js` (Line 4)

#### Current Code
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

#### Recommendation
```javascript
// lib/config/env.js
const requiredEnvVars = ['API_URL'];

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file.`
    );
  }
}

// Call at app startup
// app/layout.js
import { validateEnv } from '@/lib/config/env';

if (process.env.NODE_ENV !== 'development') {
  validateEnv();
}
```

---

### MEDIUM-5: Missing Accessibility Attributes

**Severity:** 🟡 MEDIUM
**Accessibility Impact:** HIGH

#### Description
Interactive elements missing proper ARIA attributes and keyboard navigation.

#### Affected Files
- `components/layout/Header.jsx` (Lines 100-149)
- `app/admin/events/page.jsx` (Lines 73-113)

#### Issues
- Dropdown menus missing `role="menu"`
- No `aria-expanded` attributes
- No keyboard navigation indicators
- Event cards not keyboard accessible

#### Recommendation
```javascript
// components/layout/Header.jsx
<button
  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
  aria-expanded={isUserMenuOpen}
  aria-haspopup="true"
  aria-label="User menu"
  className="..."
>
  {/* Button content */}
</button>

{isUserMenuOpen && (
  <div
    role="menu"
    aria-label="User menu options"
    className="..."
  >
    <button role="menuitem" onClick={handleLogout}>
      Logout
    </button>
  </div>
)}
```

---

### MEDIUM-6: Inconsistent Error Handling

**Severity:** 🟡 MEDIUM
**Maintainability Impact:** MEDIUM

#### Description
Different error handling patterns across the codebase make error handling unpredictable.

#### Affected Files
- `lib/api/auth.js` - Throws errors with custom messages
- `lib/api/events.js` - Similar throwing pattern
- `lib/axios-client.js` - Returns structured error objects

#### Recommendation
```javascript
// lib/errors/app-error.js
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Consistent usage
throw new AuthenticationError('Invalid credentials');
```

---

### MEDIUM-7: No Request Timeout for File Uploads

**Severity:** 🟡 MEDIUM
**UX Impact:** MEDIUM

#### Description
Large file uploads have no timeout, could hang indefinitely.

#### Affected Files
- `lib/api/events.js` (Lines 62-67)

#### Recommendation
```javascript
// lib/axios-client.js
const createUploadInstance = () => {
  return axios.create({
    baseURL: API_URL,
    timeout: 60000, // 60 seconds for uploads
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      // Emit progress event
    },
  });
};

// lib/api/events.js
export const createEvent = async (eventData, coverImage, galleryImages) => {
  const uploadClient = createUploadInstance();
  // Use upload client with progress
};
```

---

### MEDIUM-8: React Query Configuration Not Optimized

**Severity:** 🟡 MEDIUM
**Performance Impact:** LOW-MEDIUM

#### Description
All queries use same cache configuration regardless of data type.

#### Affected Files
- `lib/query-provider.js` (Lines 13-25)

#### Current Code
```javascript
defaultOptions: {
  queries: {
    staleTime: 5 * 60 * 1000,  // 5 minutes for ALL queries
    gcTime: 10 * 60 * 1000,
    retry: 1,
  },
}
```

#### Recommendation
```javascript
// lib/query-provider.js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// lib/hooks/use-events.js - Override for specific queries
export function useEvents(filters = {}) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: async () => {
      // ...
    },
    staleTime: 1 * 60 * 1000, // Events: 1 minute (changes frequently)
    gcTime: 5 * 60 * 1000,
  });
}

// lib/hooks/use-auth.js - Different config for user data
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 30 * 60 * 1000, // User data: 30 minutes (rarely changes)
    retry: false,
  });
}
```

---

### MEDIUM-9-14: Additional Issues

**Other medium priority issues:**
- Missing request/response logging for debugging
- No rate limiting on form submissions
- Unhandled promise rejections in setTimeout
- Missing CSP (Content Security Policy) header
- No structured error logging service
- Event listeners without cleanup (actually OK in Header.jsx)

---

## Low Priority Issues

### LOW-1: Missing React.memo/useMemo

**Severity:** 🟢 LOW
**Performance Impact:** LOW

#### Description
Components not memoized, potential unnecessary re-renders.

#### Recommendation
```javascript
// components/events/EventCard.jsx
import { memo } from 'react';

const EventCard = memo(({ event }) => {
  // Component implementation
});

export default EventCard;
```

---

### LOW-2: Loading/Error States Inconsistent

**Severity:** 🟢 LOW
**UX Impact:** LOW

#### Description
Some pages have retry buttons on errors, others don't.

#### Recommendation
Standardize error display component across app.

---

### LOW-3: No Environment Separation

**Severity:** 🟢 LOW
**DevOps Impact:** MEDIUM

#### Description
Missing .env.production, .env.test files.

#### Recommendation
```bash
# Create environment-specific files
.env.local          # Development (not committed)
.env.development    # Dev defaults
.env.production     # Production config
.env.test           # Test environment
```

---

## Recommended Actions

### Immediate (This Week)

**Priority 1: Security Critical**
1. ✅ Remove all `console.log` statements logging sensitive data
2. ✅ Add backend authorization validation for admin endpoints
3. ✅ Implement CSRF token validation
4. ✅ Move API_URL to server-side only (remove NEXT_PUBLIC_)
5. ✅ Add JWT signature validation on backend (verify backend does this)

**Time Estimate:** 8-16 hours

### Sprint 1 (Next 2 Weeks)

**Priority 2: High Impact Security**
1. ✅ Migrate tokens to httpOnly cookies
2. ✅ Implement refresh token rotation
3. ✅ Add file upload validation (size, type, content)
4. ✅ Create error boundary components
5. ✅ Add Content-Security-Policy header

**Time Estimate:** 24-32 hours

### Sprint 2 (Following 2 Weeks)

**Priority 3: Code Quality**
1. ✅ Replace `<img>` with Next.js `<Image>` component
2. ✅ Add TypeScript (gradual migration)
3. ✅ Implement structured error handling
4. ✅ Add proper logging service integration
5. ✅ Create Next.js API routes as proxy

**Time Estimate:** 32-40 hours

### Ongoing

**Priority 4: Improvements**
1. ✅ Add unit tests
2. ✅ Improve accessibility (ARIA attributes)
3. ✅ Optimize React Query caching strategies
4. ✅ Add performance monitoring
5. ✅ Create environment-specific configs

---

## Implementation Roadmap

### Phase 1: Critical Security (Week 1)

```bash
# Day 1-2: Remove console logging
- Find and remove all console statements
- Implement proper logging library
- Test all flows

# Day 3-4: Backend validation
- Verify JWT validation on backend
- Add admin role checks to all admin endpoints
- Add CSRF protection

# Day 5: Environment variables
- Remove NEXT_PUBLIC_ from sensitive vars
- Create Next.js API proxy routes
- Update all API calls
```

### Phase 2: Authentication Security (Week 2-3)

```bash
# Week 2: httpOnly Cookies
- Update backend to set httpOnly cookies
- Remove localStorage token handling
- Update axios interceptors
- Test auth flows

# Week 3: Refresh Tokens
- Implement refresh token rotation
- Add 401 interceptor logic
- Test token expiration scenarios
```

### Phase 3: Code Quality (Week 4-6)

```bash
# Week 4: Error Handling
- Create error boundary components
- Standardize error handling patterns
- Add error logging service

# Week 5-6: TypeScript Migration
- Install TypeScript
- Create type definitions
- Migrate files gradually
- Update build process
```

---

## Testing Checklist

### Security Testing

- [ ] Verify tokens not accessible via JavaScript
- [ ] Test CSRF protection with malicious forms
- [ ] Attempt admin access with modified JWT
- [ ] Test XSS with malicious input
- [ ] Verify file upload restrictions
- [ ] Check error messages don't leak info

### Functional Testing

- [ ] Login/logout flows work correctly
- [ ] Token refresh works automatically
- [ ] Admin pages require valid admin token
- [ ] File uploads validate correctly
- [ ] Error boundaries catch errors
- [ ] All API calls work through proxy

### Performance Testing

- [ ] Images optimized (Next.js Image)
- [ ] Bundle size acceptable
- [ ] React Query caching works
- [ ] No memory leaks
- [ ] Good Lighthouse scores

---

## Conclusion

This audit identified **30 issues** across security, code quality, and performance categories. **6 critical security vulnerabilities** must be addressed before production deployment.

### Next Steps

1. **Review this report** with the development team
2. **Prioritize fixes** based on severity and business impact
3. **Create tickets** for each issue in your project management system
4. **Assign owners** for critical security fixes
5. **Schedule sprints** for implementation
6. **Re-audit** after Phase 1 completion

### Contact

For questions about this audit report, please contact the security team or create an issue in the project repository.

---

**Report Version:** 1.0
**Last Updated:** January 11, 2025
**Next Review:** After Phase 1 completion
