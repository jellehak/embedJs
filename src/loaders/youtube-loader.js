import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { YoutubeTranscript } from 'youtube-transcript';
import createDebugMessages from 'debug';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
export class YoutubeLoader extends BaseLoader {
    constructor({ videoIdOrUrl }) {
        super(`YoutubeLoader_${md5(videoIdOrUrl)}`);
        this.debug = createDebugMessages('embedjs:loader:YoutubeLoader');
        this.videoIdOrUrl = videoIdOrUrl;
    }
    async *getChunks() {
        const chunker = new RecursiveCharacterTextSplitter({ chunkSize: 2000, chunkOverlap: 0 });
        try {
            const transcripts = await YoutubeTranscript.fetchTranscript(this.videoIdOrUrl, { lang: 'en' });
            this.debug(`Transcripts (length ${transcripts.length}) obtained for video`, this.videoIdOrUrl);
            for (const transcript of transcripts) {
                for (const chunk of await chunker.splitText(cleanString(transcript.text))) {
                    yield {
                        pageContent: chunk,
                        contentHash: md5(chunk),
                        metadata: {
                            type: 'YoutubeLoader',
                            source: this.videoIdOrUrl,
                        },
                    };
                }
            }
        }
        catch (e) {
            this.debug('Could not get transcripts for video', this.videoIdOrUrl, e);
        }
    }
}
