# extension-error-handler — Error Handling for Chrome Extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)**

**Error boundary** — global handler, error storage, retry with backoff, and async wrapping.

## 🚀 Quick Start
```typescript
import { ErrorHandler, RetryHelper } from 'extension-error-handler';
const handler = new ErrorHandler();
handler.install();
handler.on('TypeError', (e) => console.error('Type error:', e));
const data = await RetryHelper.withBackoff(() => fetch('/api'), 3);
```

## 📄 License
MIT — [Zovo](https://zovo.one)
