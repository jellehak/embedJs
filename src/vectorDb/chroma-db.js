import { ChromaClient } from 'chromadb';
export class ChromaDb {
    constructor({ url }) {
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.url = url;
    }
    async init() {
        const client = new ChromaClient({ path: this.url });
        const list = await client.listCollections();
        if (list.map((e) => e.name).indexOf(ChromaDb.STATIC_COLLECTION_NAME) > -1)
            this.collection = await client.getCollection({ name: ChromaDb.STATIC_COLLECTION_NAME });
        else
            this.collection = await client.createCollection({ name: ChromaDb.STATIC_COLLECTION_NAME });
    }
    async insertChunks(chunks) {
        const mapped = chunks.map((chunk) => {
            return {
                id: chunk.metadata.id,
                pageContent: chunk.pageContent,
                vector: chunk.vector,
                metadata: chunk.metadata,
            };
        });
        await this.collection.add({
            ids: mapped.map((e) => e.id),
            embeddings: mapped.map((e) => e.vector),
            metadatas: mapped.map((e) => e.metadata),
            documents: mapped.map((e) => e.pageContent),
        });
        return mapped.length;
    }
    async similaritySearch(query, k) {
        const results = await this.collection.query({
            nResults: k,
            queryEmbeddings: [query],
        });
        return results.documents[0].map((result, index) => {
            return {
                pageContent: result,
                metadata: {
                    id: results.ids[0][index],
                    ...results.metadatas[0][index],
                },
            };
        });
    }
    async getVectorCount() {
        return this.collection.count();
    }
    async deleteKeys(uniqueLoaderId) {
        await this.collection.delete({
            where: {
                uniqueLoaderId,
            },
        });
        return true;
    }
    async reset() {
        const client = new ChromaClient({ path: this.url });
        await client.deleteCollection({ name: ChromaDb.STATIC_COLLECTION_NAME });
        this.collection = await client.createCollection({ name: ChromaDb.STATIC_COLLECTION_NAME });
    }
}
Object.defineProperty(ChromaDb, "STATIC_COLLECTION_NAME", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'vectors'
});
