# Installation Instructions

## Installing @simplify9/simplyapiclient

This package requires `axios` as a peer dependency. You need to install both packages:

```bash
npm install @simplify9/simplyapiclient axios
```

## Why axios is a peer dependency?

Starting from version 2.1.0, we moved `axios` to peer dependencies to:
- Prevent version conflicts in your application
- Reduce bundle size by avoiding duplicate axios installations  
- Allow you to control which axios version to use
- Follow npm best practices for libraries

## Supported axios versions

This package is compatible with:
- axios `>=0.21.1` (for backward compatibility)
- axios `^1.x` (recommended)

## Error: "Cannot read properties of undefined (reading 'create')"

If you see this error, it means axios is not installed in your project. Install it with:

```bash
npm install axios
```

## Example Usage

```typescript
import ClientFactory from '@simplify9/simplyapiclient';

// Create client with default configuration
const client = ClientFactory();

// Or with custom configuration
const client = ClientFactory({
  baseUrl: 'https://api.example.com',
  authType: 'bearer',
  getBearer: () => 'your-token'
});

// Use the client
const response = await client.SimplyGetAsync('/users');
```