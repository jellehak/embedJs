import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class OpenAi extends BaseModel {
    constructor({ temperature, modelName, ...options }) {
        super(temperature);
        this.debug = createDebugMessages('embedjs:model:OpenAi');
        this.modelName = modelName;
        this.options = options
    }
    async init() {
        const options = { temperature: this.temperature, modelName: this.modelName, ...this.options }
        this.model = new ChatOpenAI(options);
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
