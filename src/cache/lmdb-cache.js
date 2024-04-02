import * as lmdb from 'lmdb';
export class LmdbCache {
    constructor({ path }) {
        Object.defineProperty(this, "dataPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "database", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dataPath = path;
    }
    async init() {
        this.database = lmdb.open({
            path: this.dataPath,
            compression: true,
        });
    }
    async addLoader(loaderId, chunkCount) {
        await this.database.put(loaderId, { chunkCount });
    }
    async getLoader(loaderId) {
        return this.database.get(loaderId);
    }
    async hasLoader(loaderId) {
        return this.database.doesExist(loaderId);
    }
    async loaderCustomSet(loaderCombinedId, value) {
        await this.database.put(loaderCombinedId, value);
    }
    async loaderCustomGet(loaderCombinedId) {
        return this.database.get(loaderCombinedId);
    }
    async loaderCustomHas(loaderCombinedId) {
        return this.database.doesExist(loaderCombinedId);
    }
    async deleteLoader(loaderId) {
        await this.database.remove(loaderId);
    }
    async loaderCustomDelete(loaderCombinedId) {
        await this.database.remove(loaderCombinedId);
    }
}
