# Extension Error Handler

Error handling library for Chrome extensions. Provides global error boundaries, crash reporting, error storage with chrome.storage, retry logic with backoff, and async wrapping. Zero runtime dependencies.

## Install

```bash
npm install extension-error-handler
```

## Quick Start

```typescript
import { ErrorHandler, RetryHelper } from 'extension-error-handler';

// Create and install global error handler
const handler = new ErrorHandler();
handler.install();

// Listen for specific error types
handler.on('TypeError', (e) => {
    console.error('Type error:', e.message);
});

handler.on('NetworkError', (e) => {
    showOfflineMessage();
});

// Set fallback handler for unhandled errors
handler.onUnhandled((e) => {
    console.error('Unhandled error:', e.message);
});

// Wrap async functions with automatic error handling
const data = await handler.wrap(() => fetch('/api'));
```

## Features

### ErrorHandler

Installs global error and unhandled rejection listeners. Supports registering handlers for specific error types and fallback handlers for unhandled errors.

```typescript
const handler = new ErrorHandler();
handler.install();

// Handle specific error types
handler.on('TypeError', (e) => handleTypeError(e));
handler.on('RangeError', (e) => handleRangeError(e));

// Fallback for unhandled errors
handler.onUnhandled((e) => logError(e));

// Wrap async operations
await handler.wrap(() => someAsyncOperation());
```

### ErrorStorage

Persists errors to chrome.storage.local. Automatically manages storage limits (keeps last 100 errors).

```typescript
import { ErrorStorage } from 'extension-error-handler';

// Get all stored errors
const errors = await ErrorStorage.getAll();

// Get recent errors
const recent = await ErrorStorage.getRecent(10);

// Clear error history
await ErrorStorage.clear();
```

### RetryHelper

Retry failed operations with exponential backoff, fixed delay, or until a condition is met.

```typescript
import { RetryHelper } from 'extension-error-handler';

// Retry with exponential backoff
const data = await RetryHelper.withBackoff(
    () => fetch('/api'),
    3,  // max retries
    1000  // base delay in ms
);

// Retry with fixed delay
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

## API Reference

### ErrorHandler

| Method | Description |
|--------|-------------|
| `install()` | Install global error and unhandledrejection listeners |
| `on(errorType, handler)` | Register handler for specific error type |
| `onUnhandled(handler)` | Register fallback handler for unhandled errors |
| `handle(error)` | Manually handle an error |
| `wrap(fn)` | Wrap async function with automatic error handling |

### ErrorStorage

| Method | Description |
|--------|-------------|
| `save(error)` | Save error to chrome.storage |
| `getAll()` | Retrieve all stored errors |
| `getRecent(count)` | Get most recent errors (default 10) |
| `clear()` | Clear all stored errors |

### RetryHelper

| Method | Description |
|--------|-------------|
| `withBackoff(fn, maxRetries, baseDelayMs)` | Retry with exponential backoff |
| `withDelay(fn, maxRetries, delayMs)` | Retry with fixed delay |
| `until(fn, condition, maxAttempts, delayMs)` | Retry until condition is met |

## Requirements

- Chrome Extensions API (manifest V3 compatible)
- TypeScript 5.0+
- chrome.storage.local permission (for ErrorStorage)

## License

MIT - Copyright (c) 2025 theluckystrike

## About

Built by theluckystrike. Part of the extension tooling ecosystem at zovo.one.
