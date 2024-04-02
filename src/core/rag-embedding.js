export class RAGEmbedding {
    static init(embeddingModel) {
        if (!this.singleton) {
            this.singleton = new RAGEmbedding(embeddingModel);
        }
    }
    static getInstance() {
        return RAGEmbedding.singleton;
    }
    static getEmbedding() {
        return RAGEmbedding.getInstance().embedding;
    }
    static translateChunks(chunks) {
        return chunks.map((chunk) => {
            return {
                pageContent: chunk.pageContent,
                metadata: chunk.metadata,
            };
        });
    }
    constructor(embeddingModel) {
        Object.defineProperty(this, "embedding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.embedding = embeddingModel;
    }
}
