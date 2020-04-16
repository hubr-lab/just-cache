

declare module "just-cache" {
    export interface JustCacheOptions {
        ttl?: number;
        limit?: number;
    }

    export default class JustCache {
        constructor (options?: JustCacheOptions);
        put(key: string, value: any): void;
        put(key: string, value: any, ttl: number): void;
        set(key: string, value: any): void;
        set(key: string, value: any, ttl: number): void;
        clean(): void;
        has(key: string): boolean;
        get<T = any>(key: string): T | null;
        delete(key: string): void;
        keys(): string[];
        count(): number;
        size(): number;
        sizeText(): string;
    }
 }

