
![](https://github.com/simplify9/SimplyApiClientJs/.github/workflows/npm-publish.yml/badge.svg)

# Simply API Client

A powerful Javascript API client built on top of axios, designed for modern React and Node.js applications.

## Features

- 🚀 Built on axios with full backward compatibility
- 🔒 JWT authentication and refresh token handling
- 🌐 Works in both browser and Node.js environments
- 📦 Zero bundling conflicts with dependency injection
- 🎯 TypeScript support with full type definitions
- ✨ Simple and intuitive API

## Installation

```bash
npm install @simplify9/simplyapiclient axios
```

**Note**: You need to install axios separately as it's a peer dependency.

## Quick Start

### 1. Setup (Required)

Before using the client, you need to provide your axios instance:

```javascript
import axios from 'axios';
import { setAxiosInstance } from '@simplify9/simplyapiclient';

// Set this ONCE at your application startup
setAxiosInstance(axios);
```

### 2. Basic Usage

```javascript
import { ClientFactory } from '@simplify9/simplyapiclient';

// Create a client instance
const apiClient = ClientFactory();

// Make API calls
const response = await apiClient.SimplyGetAsync('/users');
console.log(response.data);
```

### 3. With Configuration

```javascript
import { ClientFactory, SetBaseUrl, SetAuthType, SetGetBearer } from '@simplify9/simplyapiclient';

// Configure the client
SetBaseUrl('https://api.example.com');
SetAuthType('bearer');
SetGetBearer(() => localStorage.getItem('auth_token'));

// Create client with configuration
const apiClient = ClientFactory();

// All requests will now use the base URL and auth token
const response = await apiClient.SimplyGetAsync('/protected-endpoint');
```

## Complete Setup Guide

### For React Applications

Add this to your main `App.js` or `index.js`:

```javascript
import React from 'react';
import axios from 'axios';
import { setAxiosInstance, SetBaseUrl } from '@simplify9/simplyapiclient';

// Setup axios instance (do this once at app startup)
setAxiosInstance(axios);
SetBaseUrl(process.env.REACT_APP_API_URL || 'https://api.example.com');

function App() {
  // Your app components
  return <div>Your App</div>;
}

export default App;
```

### For Node.js Applications

```javascript
const axios = require('axios');
const { setAxiosInstance, ClientFactory } = require('@simplify9/simplyapiclient');

// Setup
setAxiosInstance(axios);

// Use the client
const client = ClientFactory();
```

## API Reference

### Client Methods

```javascript
const client = ClientFactory(config?);

// GET requests
await client.SimplyGetAsync(url, options?);

// POST requests  
await client.SimplyPostAsync(url, data?, options?);

// PUT requests
await client.SimplyPutAsync(url, data?, options?);

// DELETE requests
await client.SimplyDeleteAsync(url, options?);
```

### Configuration Functions

```javascript
import {
  SetBaseUrl,
  SetAuthType, 
  SetGetBearer,
  SetOnAuthFail,
  SetRefreshAuth
} from '@simplify9/simplyapiclient';

// Set base URL for all requests
SetBaseUrl('https://api.example.com');

// Set authentication type
SetAuthType('bearer'); // or 'basic', etc.

// Set function to get auth token
SetGetBearer(() => localStorage.getItem('token'));

// Set auth failure handler
SetOnAuthFail(() => {
  // Handle auth failure (redirect to login, etc.)
  window.location.href = '/login';
});

// Set token refresh function
SetRefreshAuth(async () => {
  // Refresh token logic
  const newToken = await refreshToken();
  localStorage.setItem('token', newToken);
  return newToken;
});
```

### Response Format

All API calls return a standardized response:

```javascript
{
  status: 200,           // HTTP status code
  succeeded: true,       // true if status 200-299
  data: {...},          // Response data
  error: null           // Error message if any
}
```

## Advanced Usage

### Custom Client Configuration

```javascript
import { ClientFactory } from '@simplify9/simplyapiclient';

const customConfig = {
  baseUrl: 'https://custom-api.com',
  authType: 'bearer',
  getBearer: () => getCustomToken(),
  onAuthFail: () => handleAuthFailure(),
  refreshAuth: () => refreshCustomToken()
};

const client = ClientFactory(customConfig);
```

### Error Handling

```javascript
try {
  const response = await client.SimplyGetAsync('/data');
  if (response.succeeded) {
    console.log('Success:', response.data);
  } else {
    console.log('API Error:', response.error);
  }
} catch (error) {
  console.log('Network Error:', error.message);
}
```

## Migration Guide

### From Version 2.1.x to 2.2.x

1. **Install axios** if not already installed:
   ```bash
   npm install axios
   ```

2. **Add axios setup** to your app:
   ```javascript
   import axios from 'axios';
   import { setAxiosInstance } from '@simplify9/simplyapiclient';
   setAxiosInstance(axios);
   ```

3. **Update axios version** if experiencing build issues:
   ```bash
   npm install axios@1.6.8
   ```

## Troubleshooting

### "Axios not found" Error

If you get this error:
```
Axios not found! Please use one of these solutions...
```

**Solution**: Make sure you call `setAxiosInstance(axios)` before creating any clients.

### Webpack Build Errors

If you see webpack errors related to axios modules:

1. Downgrade axios to a stable version:
   ```bash
   npm install axios@1.6.8
   ```

2. Make sure you're using the latest version of this package:
   ```bash
   npm install @simplify9/simplyapiclient@latest
   ```

## Requirements

- **axios**: `>=0.21.1 <2.0.0`
- **Node.js**: `>=12.0.0`
- **TypeScript**: `>=3.8` (if using TypeScript)

## License

MIT

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/simplify9/SimplyApiClientJs).