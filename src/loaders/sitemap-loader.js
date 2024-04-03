import md5 from 'md5';
import Sitemapper from 'sitemapper';
import createDebugMessages from 'debug';
import { BaseLoader } from '../interfaces/base-loader.js';
import { WebLoader } from './web-loader.js';
export class SitemapLoader extends BaseLoader {
    constructor({ url }) {
        super(`SitemapLoader_${md5(url)}`);
        this.debug = createDebugMessages('embedjs:loader:SitemapLoader');
        this.url = url;
    }
    async *getChunks() {
        try {
            // @ts-ignore
            const { sites } = await new Sitemapper({ url: this.url, timeout: 15000 }).fetch();
            this.debug(`Sitemap '${this.url}' returned ${sites.length} URLs`);
            for (const url of sites) {
                const webLoader = new WebLoader({ url });
                for await (const chunk of webLoader.getChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: 'SitemapLoader',
                            originalSource: this.url,
                        },
                    };
                }
            }
        }
        catch (e) {
            this.debug('Could not get sites from sitemap url', this.url, e);
        }
    }
}
