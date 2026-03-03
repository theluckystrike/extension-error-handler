# extension-error-handler — Error Handling for Chrome Extensions

[![npm](https://img.shields.io/npm/v/extension-error-handler.svg)](https://www.npmjs.com/package/extension-error-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)]()

> **Built by [Zovo](https://zovo.one)** — error handling across 18+ Chrome extensions

**Error boundaries, global handlers, error storage, retry with backoff, and async wrapping** for Chrome extensions. Zero runtime dependencies.

## 📦 Install

```bash
npm install extension-error-handler
```

## 🚀 Quick Start

```typescript
import { ErrorHandler, RetryHelper } from 'extension-error-handler';

// Create and install global handler
const handler = new ErrorHandler();
handler.install();

// Listen for specific error types
handler.on('TypeError', (e) => {
    console.error('Type error:', e.message);
});

handler.on('NetworkError', (e) => {
    showOfflineMessage();
});

// Retry with backoff
const data = await RetryHelper.withBackoff(
    () => fetch('/api'),
    3  // max attempts
);
```

## ✨ Features

### Global Error Handler

```typescript
const handler = new ErrorHandler({
    storeErrors: true,
    maxStoredErrors: 100
});

handler.install();

// Handle all errors
handler.on('error', (error, context) => {
    console.error('Caught:', error.message);
});

// Handle specific error types
handler.on('TypeError', (e) => handleTypeError(e));
handler.on('RangeError', (e) => handleRangeError(e));
```

### Async Error Wrapper

```typescript
import { withErrorHandling } from 'extension-error-handler';

// Wrap async functions
const safeFetch = withErrorHandling(fetch, {
    onError: (e) => {
        console.error('Fetch failed:', e);
        return null;
    }
});

const data = await safeFetch('/api/data');
```

### Retry Helper

```typescript
import { RetryHelper } from 'extension-error-handler';

// Simple retry
await RetryHelper.retry(() => apiCall(), 3);

// With backoff
await RetryHelper.withBackoff(() => apiCall(), {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential'
});
```

### Error Recovery

```typescript
// Try multiple strategies
const data = await RetryHelper.fallback(
    () => fetch('/api/v1/data'),
    () => fetch('/api/v2/data'),
    () => loadCachedData()
);
```

## API Reference

### `ErrorHandler`

| Method | Description |
|--------|-------------|
| `install()` | Install global handlers |
| `on(type, handler)` | Register error listener |
| `off(type, handler)` | Remove listener |
| `getErrors()` | Get stored errors |
| `clearErrors()` | Clear error history |

### `RetryHelper`

| Method | Description |
|--------|-------------|
| `retry(fn, attempts)` | Simple retry |
| `withBackoff(fn, options)` | Retry with backoff |
| `fallback(...fns)` | Try multiple functions |

## 📄 License

MIT — [Zovo](https://zovo.one)
