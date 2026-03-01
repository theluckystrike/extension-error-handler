/**
 * Error Handler — Global error boundary for Chrome extensions
 */
export class ErrorHandler {
    private handlers = new Map<string, (error: Error) => void>();
    private fallback?: (error: Error) => void;

    /** Install global error handler */
    install(): void {
        if (typeof self !== 'undefined') {
            self.addEventListener('error', (e) => this.handle(e.error || new Error(e.message)));
            self.addEventListener('unhandledrejection', (e) => this.handle(e.reason instanceof Error ? e.reason : new Error(String(e.reason))));
        }
    }

    /** Register handler for specific error types */
    on(errorType: string, handler: (error: Error) => void): this {
        this.handlers.set(errorType, handler);
        return this;
    }

    /** Set fallback handler */
    onUnhandled(handler: (error: Error) => void): this { this.fallback = handler; return this; }

    /** Manually handle an error */
    handle(error: Error): void {
        const handler = this.handlers.get(error.name) || this.handlers.get(error.constructor.name);
        if (handler) handler(error);
        else this.fallback?.(error);
        ErrorStorage.save(error);
    }

    /** Wrap async function with error handling */
    wrap<T>(fn: () => Promise<T>): Promise<T | undefined> {
        return fn().catch((e) => { this.handle(e); return undefined; });
    }
}

/** Error Storage — Persist errors to chrome.storage */
export class ErrorStorage {
    static async save(error: Error): Promise<void> {
        try {
            const result = await chrome.storage.local.get('__errors__');
            const errors = (result.__errors__ as Array<Record<string, unknown>>) || [];
            errors.push({ name: error.name, message: error.message, stack: error.stack, timestamp: Date.now() });
            if (errors.length > 100) errors.splice(0, errors.length - 100);
            await chrome.storage.local.set({ __errors__: errors });
        } catch { }
    }

    static async getAll(): Promise<Array<{ name: string; message: string; stack?: string; timestamp: number }>> {
        const result = await chrome.storage.local.get('__errors__');
        return (result.__errors__ as any[]) || [];
    }

    static async getRecent(count: number = 10): Promise<Array<Record<string, unknown>>> {
        const all = await this.getAll();
        return all.slice(-count);
    }

    static async clear(): Promise<void> { await chrome.storage.local.remove('__errors__'); }
}
