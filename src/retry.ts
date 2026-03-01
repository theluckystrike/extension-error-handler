/**
 * Retry Helper — Retry failed operations with backoff
 */
export class RetryHelper {
    /** Retry with exponential backoff */
    static async withBackoff<T>(fn: () => Promise<T>, maxRetries: number = 3, baseDelayMs: number = 1000): Promise<T> {
        let lastError: Error = new Error('Retry failed');
        for (let i = 0; i <= maxRetries; i++) {
            try { return await fn(); }
            catch (e) {
                lastError = e instanceof Error ? e : new Error(String(e));
                if (i < maxRetries) await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
            }
        }
        throw lastError;
    }

    /** Retry with fixed delay */
    static async withDelay<T>(fn: () => Promise<T>, maxRetries: number = 3, delayMs: number = 1000): Promise<T> {
        let lastError: Error = new Error('Retry failed');
        for (let i = 0; i <= maxRetries; i++) {
            try { return await fn(); }
            catch (e) {
                lastError = e instanceof Error ? e : new Error(String(e));
                if (i < maxRetries) await new Promise((r) => setTimeout(r, delayMs));
            }
        }
        throw lastError;
    }

    /** Retry until condition met */
    static async until<T>(fn: () => Promise<T>, condition: (result: T) => boolean, maxAttempts: number = 10, delayMs: number = 500): Promise<T> {
        for (let i = 0; i < maxAttempts; i++) {
            const result = await fn();
            if (condition(result)) return result;
            await new Promise((r) => setTimeout(r, delayMs));
        }
        throw new Error('Condition never met');
    }
}
