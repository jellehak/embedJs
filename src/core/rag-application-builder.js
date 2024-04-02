import { RAGApplication } from './rag-application.js';
import { SIMPLE_MODELS } from '../global/constants.js';
import { OpenAi } from '../models/openai-model.js';
export class RAGApplicationBuilder {
    constructor() {
        Object.defineProperty(this, "searchResultCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "loaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vectorDb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "queryTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddingModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initLoaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.loaders = [];
        this.temperature = 0.1;
        this.searchResultCount = 7;
        this.initLoaders = true;
        this.queryTemplate = `You are a helpful human like chat bot. Use all the provided context to answer the query at the end. Answer in full.
        If you don't know the answer, just say that you don't know, don't try to make up an answer. 
        
        Do not use words like context or training data when responding. You can say you may not have all the information but do not say that you are not a reliable source.`;
        this.setModel(SIMPLE_MODELS.OPENAI_GPT3_TURBO);
    }
    async build() {
        const entity = new RAGApplication(this);
        await entity.init();
        return entity;
    }
    addLoader(loader) {
        this.loaders.push(loader);
        return this;
    }
    setSearchResultCount(searchResultCount) {
        this.searchResultCount = searchResultCount;
        return this;
    }
    setVectorDb(vectorDb) {
        this.vectorDb = vectorDb;
        return this;
    }
    setTemperature(temperature) {
        this.temperature = temperature;
        if (this.model)
            this.setModel(this.model);
        return this;
    }
    setQueryTemplate(queryTemplate) {
        // if (!queryTemplate.includes('{0}'))
        //     throw new Error('queryTemplate must include a placeholder for the query using {0}');
        this.queryTemplate = queryTemplate;
        return this;
    }
    setCache(cache) {
        this.cache = cache;
        return this;
    }
    setEmbeddingModel(embeddingModel) {
        this.embeddingModel = embeddingModel;
        return this;
    }
    setLoaderInit(shouldDo) {
        this.initLoaders = shouldDo;
        return this;
    }
    setModel(model) {
        if (typeof model === 'object')
            this.model = model;
        else {
            if (model === SIMPLE_MODELS.OPENAI_GPT3_TURBO)
                this.model = new OpenAi({ modelName: 'gpt-3.5-turbo' });
            else if (model === SIMPLE_MODELS.OPENAI_GPT4)
                this.model = new OpenAi({ modelName: 'gpt-4' });
            else
                this.model = new OpenAi({ modelName: model });
        }
        return this;
    }
    getLoaders() {
        return this.loaders;
    }
    getSearchResultCount() {
        return this.searchResultCount;
    }
    getVectorDb() {
        return this.vectorDb;
    }
    getTemperature() {
        return this.temperature;
    }
    getQueryTemplate() {
        return this.queryTemplate;
    }
    getCache() {
        return this.cache;
    }
    getEmbeddingModel() {
        return this.embeddingModel;
    }
    getLoaderInit() {
        return this.initLoaders;
    }
    getModel() {
        return this.model;
    }
}
