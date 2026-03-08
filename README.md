# Extension Error Handler

<p>

[![npm version](https://img.shields.io/npm/v/extension-error-handler)](https://www.npmjs.com/package/extension-error-handler)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Chrome Extensions](https://img.shields.io/badge/Chrome-Extensions-Manifest%20V3-4285f4?style=flat&logo=google-chrome)](https://developer.chrome.com/docs/extensions/)

</p>

> Zero-dependency error handling library for Chrome extensions. Provides global error boundaries, crash reporting, persistent error storage, retry logic with backoff, and async wrapping.

## Why Extension Error Handler?

Chrome extensions run in a unique environment where errors can silently fail or crash entire contexts. This library provides:

- 🛡️ **Global Error Boundaries** — Catch unhandled errors and promise rejections across all extension contexts
- 💾 **Persistent Error Storage** — Automatically save errors to `chrome.storage.local` for debugging
- 🔄 **Retry Logic** — Exponential backoff and fixed-delay retry patterns
- 🎯 **Type-Specific Handling** — Register handlers for specific error types
- ⚡ **Zero Dependencies** — Lightweight, production-ready

## Installation

```bash
npm install extension-error-handler
```

Or with yarn:

```bash
yarn add extension-error-handler
```

## Quick Start

```typescript
import { ErrorHandler, ErrorStorage, RetryHelper } from 'extension-error-handler';

// Create and install global error handler
const handler = new ErrorHandler();
handler.install();

// Handle specific error types
handler.on('TypeError', (e) => {
  console.error('Type error:', e.message);
  showUserFriendlyMessage('Invalid data format');
});

handler.on('NetworkError', (e) => {
  console.error('Network error:', e.message);
  showOfflineMessage();
});

// Fallback for unhandled errors
handler.onUnhandled((e) => {
  console.error('Unhandled error:', e.message);
  reportToAnalytics(e);
});

// Wrap async functions with automatic error handling
const data = await handler.wrap(() => fetch('/api/data'));
```

## Features

### ErrorHandler — Global Error Boundary

Installs global error and unhandled rejection listeners. Supports registering handlers for specific error types and fallback handlers for unhandled errors.

```typescript
const handler = new ErrorHandler();
handler.install();

// Handle specific error types
handler.on('TypeError', (e) => handleTypeError(e));
handler.on('RangeError', (e) => handleRangeError(e));
handler.on('ReferenceError', (e) => handleReferenceError(e));

// Fallback for unhandled errors
handler.onUnhandled((e) => logError(e));

// Wrap async operations with automatic error handling
await handler.wrap(() => someAsyncOperation());

// Manually handle an error
try {
  await riskyOperation();
} catch (e) {
  handler.handle(e as Error);
}
```

### ErrorStorage — Persistent Error History

Persists errors to `chrome.storage.local`. Automatically manages storage limits (keeps last 100 errors).

```typescript
import { ErrorStorage } from 'extension-error-handler';

// Get all stored errors
const errors = await ErrorStorage.getAll();

// Get recent errors (default: 10)
const recent = await ErrorStorage.getRecent(10);

// Clear error history
await ErrorStorage.clear();

// Errors include: name, message, stack, timestamp
console.log(recent[0]?.message);
```

### RetryHelper — Resilient Operations

Retry failed operations with exponential backoff, fixed delay, or until a condition is met.

```typescript
import { RetryHelper } from 'extension-error-handler';

// Retry with exponential backoff (1s, 2s, 4s)
const data = await RetryHelper.withBackoff(
  () => fetch('/api').then(r => r.json()),
  3,  // max retries
  1000  // base delay in ms
);

// Retry with fixed delay (1s, 1s, 1s)
const result = await RetryHelper.withDelay(
  () => apiCall(),
  5,  // max retries
  2000  // delay in ms
);

// Retry until condition is met
const value = await RetryHelper.until(
  () => checkStatus(),
  (result) => result.status === 'ready',
  10,  // max attempts
  500  // delay in ms
);
```

### Recovery Patterns

Combine error handling with retry logic for robust error recovery:

```typescript
import { ErrorHandler, RetryHelper, ErrorStorage } from 'extension-error-handler';

const handler = new ErrorHandler();
handler.install();

handler.on('NetworkError', async (e) => {
  // Retry failed network requests automatically
  await RetryHelper.withBackoff(
    () => fetch('/api/retry-endpoint'),
    3,
    1000
  );
});

handler.onUnhandled(async (e) => {
  // Log error for later analysis
  console.error('Error occurred:', e.message);
  
  // Show user-friendly message
  showNotification('Something went wrong. Please try again.');
  
  // Attempt recovery
  await recoverApplicationState();
});
```

## API Reference

### ErrorHandler

| Method | Description |
|--------|-------------|
| `install()` | Install global `error` and `unhandledrejection` event listeners |
| `on(errorType, handler)` | Register handler for a specific error type (e.g., `'TypeError'`) |
| `onUnhandled(handler)` | Register fallback handler for unhandled errors |
| `handle(error)` | Manually handle an error (triggers appropriate handler and saves to storage) |
| `wrap(fn)` | Wrap an async function with automatic error handling. Returns `T \| undefined` on error |

### ErrorStorage

| Method | Description |
|--------|-------------|
| `save(error)` | Save error to `chrome.storage.local` |
| `getAll()` | Retrieve all stored errors |
| `getRecent(count?)` | Get most recent errors (default: 10) |
| `clear()` | Clear all stored errors |

### RetryHelper

| Method | Description |
|--------|-------------|
| `withBackoff(fn, maxRetries, baseDelayMs)` | Retry with exponential backoff (delay doubles each attempt) |
| `withDelay(fn, maxRetries, delayMs)` | Retry with fixed delay between attempts |
| `until(fn, condition, maxAttempts, delayMs)` | Retry until condition returns `true` |

## Project Structure

```
extension-error-handler/
├── src/
│   ├── index.ts         # Main exports
│   ├── handler.ts      # ErrorHandler class & ErrorStorage
│   ├── retry.ts        # RetryHelper class
│   └── storage.ts      # Storage utilities (re-export)
├── package.json
├── tsconfig.json
├── jest.config.js
├── LICENSE
└── README.md
```

## Requirements

- Chrome Extensions API (Manifest V3 compatible)
- TypeScript 5.0+
- `chrome.storage.local` permission (required for ErrorStorage)

## Permissions

Add to your `manifest.json`:

```json
{
  "permissions": [
    "storage"
  ]
}
```

## License

MIT — Copyright (c) 2025 [theluckystrike](https://github.com/theluckystrike)

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
