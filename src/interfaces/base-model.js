import createDebugMessages from 'debug';
export class BaseModel {
    static setDefaultTemperature(temperature) {
        BaseModel.defaultTemperature = temperature;
    }
    constructor(temperature) {
        Object.defineProperty(this, "baseDebug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:BaseModel')
        });
        Object.defineProperty(this, "conversationMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._temperature = temperature;
        this.conversationMap = new Map();
    }
    get temperature() {
        return this._temperature ?? BaseModel.defaultTemperature;
    }
    async init() { }
    async query(system, userQuery, supportingContext, conversationId = 'default') {
        if (!this.conversationMap.has(conversationId))
            this.conversationMap.set(conversationId, []);
        const conversationHistory = this.conversationMap.get(conversationId);
        this.baseDebug(`${conversationHistory.length} history entries found for conversationId '${conversationId}'`);
        const result = await this.runQuery(system, userQuery, supportingContext, conversationHistory);
        conversationHistory.push({ message: userQuery, sender: 'HUMAN' });
        conversationHistory.push({ message: result, sender: 'AI' });
        return result;
    }
}
