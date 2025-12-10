# API Module Documentation

This directory contains all API functions organized by domain, using Axios with interceptors for automatic authentication and error handling.

## Architecture

```
lib/
├── axios-client.js          # Configured Axios instance with interceptors
├── api.js                   # Generic CRUD operations + re-exports
└── api/
    ├── index.js            # Central export point
    ├── auth.js             # Authentication functions
    ├── events.js           # Events CRUD
    └── [future modules]    # Programs, blog, user, etc.
```

## Axios Client Features

### Automatic Token Injection
All requests automatically include the `Authorization: Bearer {token}` header if a token exists in localStorage.

### Response Interceptor
- Automatically extracts `data` from responses
- Handles common HTTP errors (401, 403, 404, 409, etc.)
- Redirects to login on 401 (Unauthorized)
- Provides user-friendly error messages

### Request Interceptor
- Adds auth token to all requests
- Sets default `Content-Type: application/json`

## Usage Patterns

### 1. Direct API Functions (Recommended)

```javascript
import { loginUser, getEvents } from '@/lib/api';

// Login
try {
  const response = await loginUser({ email, password });
  // response = { access_token, refresh_token, ... }
} catch (error) {
  console.error(error.message); // User-friendly error
}

// Get events
const events = await getEvents({ category: 'meditation' });


```

### 2. Generic CRUD Operations

```javascript
import { api } from '@/lib/api';

// GET request
const data = await api.get('/custom-endpoint');

// POST request
const created = await api.post('/custom-endpoint', { data });

// PUT request
const updated = await api.put('/custom-endpoint/123', { data });

// DELETE request
await api.delete('/custom-endpoint/123');
```

### 3. Advanced Usage with Axios Client

```javascript
import { axiosClient } from '@/lib/api';

// Custom config (e.g., file upload)
const formData = new FormData();
formData.append('file', file);

const response = await axiosClient.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (progressEvent) => {
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    console.log(`Upload: ${percent}%`);
  },
});
```

## Error Handling

All API functions throw errors with user-friendly messages:

```javascript
try {
  await loginUser(credentials);
} catch (error) {
  // error.message = "Invalid email or password"
  // error.status = 401
  alert(error.message);
}
```

### Common Error Status Codes

| Status | Meaning | Automatic Handling |
|--------|---------|-------------------|
| 401 | Unauthorized | Clears token, redirects to login |
| 403 | Forbidden | Shows permission error |
| 404 | Not Found | Shows not found error |
| 409 | Conflict | Shows conflict error (e.g., "Email already exists") |
| 422 | Validation Error | Shows validation error |
| 500 | Server Error | Shows server error message |

## Authentication Functions

### `loginUser(credentials)`
```javascript
const response = await loginUser({ email, password });
// Returns: { access_token, refresh_token, token_type, expires_in }
```

### `signupUser(userData)`
```javascript
const response = await signupUser({ name, email, password });
// Returns: { access_token, refresh_token, token_type, expires_in }
```

### `getCurrentUser()`
```javascript
const user = await getCurrentUser();
// Returns: { userId, email, name, role }
```

### `logoutUser()`
```javascript
await logoutUser();
// Returns: void
```

### `refreshAccessToken(refreshToken)`
```javascript
const newTokens = await refreshAccessToken(refreshToken);
// Returns: { access_token, refresh_token, ... }
```

### `updateUserRole(role)`
```javascript
const updated = await updateUserRole({ role: 'event_manager' });
// Returns: Updated user data
```

## Events Functions

### `getEvents(params)`
```javascript
const events = await getEvents({ category: 'retreat', limit: 10 });
// Returns: Array of events
```

### `getEvent(eventId)`
```javascript
const event = await getEvent('123');
// Returns: Event object
```

### `createEvent(eventData)` (Admin only)
```javascript
const event = await createEvent({
  title: 'Weekend Retreat',
  date: '2025-12-15',
  capacity: 50,
});
// Returns: Created event
```

### `updateEvent(eventId, eventData)` (Admin only)
```javascript
// Note: This endpoint is now handled directly in use-events.js via generic api.patch
const updated = await api.patch('/admin/event/123', { capacity: 60 });
// Returns: Updated event
```

### `deleteEvent(eventId)` (Admin only)
```javascript
await deleteEvent('123');
// Returns: void
```



## Adding New API Modules

Create a new file in `lib/api/` following this pattern:

```javascript
// lib/api/programs.js
import axiosClient from '../axios-client';

export const getPrograms = async (params = {}) => {
  try {
    const response = await axiosClient.get('/programs', { params });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch programs');
  }
};

export const enrollInProgram = async (programId, enrollmentData) => {
  try {
    const response = await axiosClient.post(`/programs/${programId}/enroll`, enrollmentData);
    return response;
  } catch (error) {
    if (error.status === 409) {
      throw new Error('Already enrolled in this program');
    }
    throw new Error(error.message || 'Failed to enroll');
  }
};
```

Then export from `lib/api/index.js`:
```javascript
export * from './programs';
```

## TanStack Query Integration

Use these API functions with TanStack Query hooks:

```javascript
// lib/hooks/use-events.js
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEvents } from '@/lib/api';

export function useEvents(filters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });
}



## Best Practices

1. **Always use API functions** - Don't use `axiosClient` directly unless you need custom config
2. **Handle errors** - Wrap API calls in try-catch blocks
3. **Use TanStack Query** - For server state management (see `lib/hooks/`)
4. **Domain organization** - Group related functions in their own module
5. **Consistent error messages** - Provide user-friendly error messages for common cases
6. **Type safety** - Add JSDoc comments for better IDE support (or TypeScript in the future)

## Environment Variables

Set the API base URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://isipathana-meditation-center.onrender.com/api
```

For local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
