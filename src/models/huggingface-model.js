import createDebugMessages from 'debug';
import { HuggingFaceInference } from '@langchain/community/llms/hf';
import { BaseModel } from '../interfaces/base-model.js';
export class HuggingFace extends BaseModel {
    constructor(params) {
        super(params?.temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:HuggingFace')
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxNewTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "endpointUrl", {
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
        this.endpointUrl = params?.endpointUrl;
        this.maxNewTokens = params?.maxNewTokens ?? 300;
        this.modelName = params?.modelName ?? 'mistralai/Mixtral-8x7B-Instruct-v0.1';
    }
    async init() {
        this.model = new HuggingFaceInference({
            model: this.modelName,
            maxTokens: this.maxNewTokens,
            temperature: this.temperature,
            endpointUrl: this.endpointUrl,
            verbose: false,
            maxRetries: 1,
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [system];
        pastMessages.push(`Data: ${supportingContext.map((s) => s.pageContent).join('; ')}`);
        pastMessages.push.apply(pastConversations.map((c) => {
            if (c.sender === 'AI')
                return `AI: ${c.message}`;
            return `HUMAN: ${c.message}`;
        }));
        pastMessages.push(`Question: ${userQuery}?`);
        pastMessages.push('Answer: ');
        const finalPrompt = pastMessages.join('\n');
        // this.debug('Final prompt being sent to HF - ', finalPrompt);
        this.debug(`Executing hugging face '${this.model.model}' model with prompt -`, userQuery);
        const result = await this.model.invoke(finalPrompt, {});
        return result;
    }
}
