export class MemoryCache {
    constructor() {
        Object.defineProperty(this, "loaderList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "loaderCustomValues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async init() {
        this.loaderList = {};
        this.loaderCustomValues = {};
    }
    async addLoader(loaderId, chunkCount) {
        this.loaderList[loaderId] = { chunkCount };
    }
    async getLoader(loaderId) {
        return this.loaderList[loaderId];
    }
    async hasLoader(loaderId) {
        return this.loaderList.hasOwnProperty(loaderId);
    }
    async loaderCustomSet(loaderCombinedId, value) {
        this.loaderCustomValues[loaderCombinedId] = value;
    }
    async loaderCustomGet(loaderCombinedId) {
        return this.loaderCustomValues[loaderCombinedId];
    }
    async loaderCustomHas(loaderCombinedId) {
        return this.loaderCustomValues.hasOwnProperty(loaderCombinedId);
    }
    async deleteLoader(loaderId) {
        delete this.loaderList[loaderId];
    }
    async loaderCustomDelete(loaderCombinedId) {
        delete this.loaderList[loaderCombinedId];
    }
}
