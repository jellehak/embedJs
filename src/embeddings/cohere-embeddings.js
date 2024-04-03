import { CohereEmbeddings as LangChainCohereEmbeddings } from '@langchain/cohere';
export class CohereEmbeddings {
    constructor() {
        this.model = new LangChainCohereEmbeddings({
            model: 'embed-english-v2.0',
            maxConcurrency: 3,
            maxRetries: 5,
        });
    }
    getDimensions() {
        return 4096;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
