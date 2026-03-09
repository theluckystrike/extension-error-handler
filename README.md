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

## Advanced Usage

### Custom Reporters

Create custom error reporters to send errors to external services like Sentry, LogRocket, or your own backend:

```typescript
import { ErrorHandler, ErrorStorage } from 'extension-error-handler';

class SentryReporter {
  private dsn: string;
  
  constructor(dsn: string) {
    this.dsn = dsn;
  }
  
  async report(error: Error): Promise<void> {
    await fetch(this.dsn, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    });
  }
}

const reporter = new SentryReporter('https://sentry.io/api/projects/your-project');
const handler = new ErrorHandler();
handler.install();

// Send errors to Sentry
handler.onUnhandled(async (e) => {
  await reporter.report(e);
});
```

### Error Grouping

Group similar errors to reduce noise and focus on unique issues:

```typescript
import { ErrorHandler, ErrorStorage } from 'extension-error-handler';

interface ErrorGroup {
  key: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  errors: Error[];
}

// Generate grouping key from error characteristics
function getGroupKey(error: Error): string {
  // Group by error type and first line of stack trace
  const stackLine = error.stack?.split('\n')[1]?.trim() || '';
  return `${error.name}:${error.message.substring(0, 50)}:${stackLine.substring(0, 50)}`;
}

const errorGroups = new Map<string, ErrorGroup>();

handler.onUnhandled(async (e) => {
  const key = getGroupKey(e);
  const existing = errorGroups.get(key);
  
  if (existing) {
    existing.count++;
    existing.lastSeen = Date.now();
    existing.errors.push(e);
    console.log(`Error group "${key}" occurred ${existing.count} times`);
  } else {
    errorGroups.set(key, {
      key,
      count: 1,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      errors: [e]
    });
  }
  
  // Only alert on new error groups or high-frequency issues
  if (!existing || existing.count > 10) {
    await notifyTeam(key, existing?.count || 1);
  }
});
```

### Rate Limiting

Prevent error floods from overwhelming your reporting system:

```typescript
import { ErrorHandler } from 'extension-error-handler';

class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second
  
  constructor(maxTokens: number = 10, refillRate: number = 1) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }
  
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
  
  tryConsume(tokens: number = 1): boolean {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}

const rateLimiter = new RateLimiter(10, 1); // 10 initial, 1 per second
const handler = new ErrorHandler();
handler.install();

handler.onUnhandled(async (e) => {
  if (rateLimiter.tryConsume()) {
    await sendToAnalytics(e);
  } else {
    console.warn('Rate limited - error not sent to analytics');
  }
});
```

### Integration with Chrome Background Script

Error handling works across all extension contexts:

```typescript
// background.ts
import { ErrorHandler, ErrorStorage } from 'extension-error-handler';

const handler = new ErrorHandler();
handler.install();

// Handle errors from content scripts via message passing
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'error') {
    const error = new Error(message.error.message);
    error.name = message.error.name;
    error.stack = message.error.stack;
    handler.handle(error);
  }
});

// Content script: send errors to background
try {
  await riskyOperation();
} catch (e) {
  chrome.runtime.sendMessage({
    type: 'error',
    error: {
      name: e.name,
      message: e.message,
      stack: e.stack
    }
  });
}
```

### Best Practices

1. **Install Early**: Call `handler.install()` at the very start of your extension
2. **Handle Types Specifically**: Register handlers for expected error types
3. **Always Have Fallback**: Set an `onUnhandled` handler for unexpected errors
4. **Persist Critical Errors**: Use `ErrorStorage` for errors that need post-mortem analysis
5. **Combine with Retry**: Use `RetryHelper` for network operations
6. **Test Error Paths**: Verify error handling works in your extension's context

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
