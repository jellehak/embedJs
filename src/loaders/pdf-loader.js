import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'node:fs/promises';
import pdf from 'pdf-parse-fork';
import axios from 'axios';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
export class PdfLoader extends BaseLoader {
    constructor({ filePath, url }) {
        super(`PdfLoader_${md5(filePath ? `FILE_${filePath}` : `URL_${url}`)}`);
        Object.defineProperty(this, "pathOrUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.isUrl = filePath ? false : true;
        this.pathOrUrl = filePath ?? url;
    }
    async *getChunks() {
        const chunker = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });
        let fileBuffer;
        if (!this.isUrl)
            fileBuffer = await fs.readFile(this.pathOrUrl);
        else
            fileBuffer = Buffer.from((await axios.get(this.pathOrUrl, { responseType: 'arraybuffer' })).data, 'binary');
        const pdfParsed = await pdf(fileBuffer);
        const chunks = await chunker.splitText(cleanString(pdfParsed.text));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                contentHash: md5(chunk),
                metadata: {
                    type: 'PdfLoader',
                    source: this.pathOrUrl,
                },
            };
        }
    }
}
