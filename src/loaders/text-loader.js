import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString, truncateCenterString } from '../util/strings.js';
export class TextLoader extends BaseLoader {
    constructor({ text }) {
        super(`TextLoader_${md5(text)}`);
        this.text = text;
    }
    async *getChunks() {
        const tuncatedObjectString = truncateCenterString(this.text, 50);
        const chunker = new RecursiveCharacterTextSplitter({ chunkSize: 300, chunkOverlap: 0 });
        const chunks = await chunker.splitText(cleanString(this.text));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                contentHash: md5(chunk),
                metadata: {
                    type: 'TextLoader',
                    source: tuncatedObjectString,
                    textId: this.uniqueId,
                },
            };
        }
    }
}
