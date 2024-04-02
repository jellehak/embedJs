import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class OpenAi extends BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:OpenAi')
        });
        Object.defineProperty(this, "modelName", {
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
        this.modelName = modelName;
    }
    async init() {
        this.model = new ChatOpenAI({ temperature: this.temperature, modelName: this.modelName });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new SystemMessage(system)];
        pastMessages.push(new SystemMessage(`Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`));
        pastMessages.push.apply(pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new AIMessage({
                    content: c.message,
                });
            return new HumanMessage({
                content: c.message,
            });
        }));
        pastMessages.push(new HumanMessage(`${userQuery}?`));
        this.debug('Executing openai model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages, {});
        return result.content.toString();
    }
}
