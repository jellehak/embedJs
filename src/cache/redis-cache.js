import { Redis } from 'ioredis';
export class RedisCache {
    constructor(options) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "redis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        options.keyPrefix = options.keyPrefix ?? 'REDIS_CACHE';
        this.options = options;
    }
    async init() {
        this.redis = new Redis(this.options);
    }
    async addLoader(loaderId, chunkCount) {
        await this.redis.set(loaderId, JSON.stringify({ chunkCount }));
    }
    async getLoader(loaderId) {
        const result = await this.redis.get(loaderId);
        if (!result)
            return null;
        return JSON.parse(result);
    }
    async hasLoader(loaderId) {
        return !!(await this.redis.get(loaderId));
    }
    async loaderCustomSet(loaderCombinedId, value) {
        await this.redis.set(loaderCombinedId, JSON.stringify(value));
    }
    async loaderCustomGet(loaderCombinedId) {
        const result = await this.redis.get(loaderCombinedId);
        if (!result)
            return null;
        return JSON.parse(result);
    }
    async loaderCustomHas(loaderCombinedId) {
        return !!(await this.redis.get(loaderCombinedId));
    }
    async deleteLoader(loaderId) {
        await this.redis.del(loaderId);
    }
    async loaderCustomDelete(loaderCombinedId) {
        await this.redis.del(loaderCombinedId);
    }
}
