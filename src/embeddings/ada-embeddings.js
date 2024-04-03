import { OpenAIEmbeddings } from '@langchain/openai';
export class AdaEmbeddings {
    constructor() {
        this.model = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002', maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return 1536;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
