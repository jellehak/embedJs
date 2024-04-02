import { OpenAIEmbeddings } from '@langchain/openai';
export class OpenAi3LargeEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small', maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return 3072;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
