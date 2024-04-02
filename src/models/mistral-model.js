import createDebugMessages from 'debug';
import { ChatMistralAI } from '@langchain/mistralai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class Mistral extends BaseModel {
    constructor({ temperature, accessToken, modelName, }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:Mistral')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new ChatMistralAI({ apiKey: accessToken, modelName: modelName ?? 'mistral-medium' });
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
        this.debug('Executing mistral model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        return result.content.toString();
    }
}
