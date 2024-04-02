import createDebugMessages from 'debug';
import { EventEmitter } from 'node:events';
export class BaseLoader extends EventEmitter {
    static setCache(cache) {
        BaseLoader.cache = cache;
    }
    constructor(uniqueId, canIncrementallyLoad = false) {
        super();
        Object.defineProperty(this, "uniqueId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_canIncrementallyLoad", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.uniqueId = uniqueId;
        this._canIncrementallyLoad = canIncrementallyLoad;
        createDebugMessages('embedjs:loader:BaseLoader')(`New loader class initalized with key ${uniqueId}`);
    }
    async init() { }
    get canIncrementallyLoad() {
        return this._canIncrementallyLoad;
    }
    getUniqueId() {
        return this.uniqueId;
    }
    getCustomCacheKey(key) {
        return `LOADER_CUSTOM_${this.uniqueId}_${key}`;
    }
    async checkInCache(key) {
        if (!BaseLoader.cache)
            return false;
        return BaseLoader.cache.loaderCustomHas(this.getCustomCacheKey(key));
    }
    async getFromCache(key) {
        if (!BaseLoader.cache)
            return null;
        return BaseLoader.cache.loaderCustomGet(this.getCustomCacheKey(key));
    }
    async saveToCache(key, value) {
        if (!BaseLoader.cache)
            return;
        await BaseLoader.cache.loaderCustomSet(this.getCustomCacheKey(key), value);
    }
    async deleteFromCache(key) {
        if (!BaseLoader.cache)
            return false;
        return BaseLoader.cache.loaderCustomDelete(this.getCustomCacheKey(key));
    }
    async loadIncrementalChunk(incrementalGenerator) {
        this.emit('incrementalChunkAvailable', incrementalGenerator);
    }
}
