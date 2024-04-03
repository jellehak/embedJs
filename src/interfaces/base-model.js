import createDebugMessages from 'debug';
export class BaseModel {
    static setDefaultTemperature(temperature) {
        BaseModel.defaultTemperature = temperature;
    }
    constructor(temperature) {
        this.baseDebug = createDebugMessages('embedjs:model:BaseModel');
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
