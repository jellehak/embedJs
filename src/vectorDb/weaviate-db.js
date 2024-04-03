import createDebugMessages from 'debug';
import weaviate, { ApiKey, generateUuid5 } from 'weaviate-ts-client';
import { toTitleCase } from '../util/strings.js';
export class WeaviateDb {
    constructor({ host, apiKey, className }) {
        this.debug = createDebugMessages('embedjs:vector:WeaviateDb');
        // @ts-ignore
        this.client = weaviate.client({ scheme: 'https', host, apiKey: new ApiKey(apiKey) });
        this.className = toTitleCase(className); // Weaviate translates the className during create to title case and errors at other places
    }
    async init({ dimensions }) {
        this.dimensions = dimensions;
        const { classes: list } = await this.client.schema.getter().do();
        if (list.map((l) => l.class).indexOf(this.className) > -1)
            return;
        await this.client.schema
            .classCreator()
            .withClass({
            class: this.className,
            properties: [
                {
                    name: 'realId',
                    dataType: ['text'],
                },
                {
                    name: 'pageContent',
                    dataType: ['text'],
                },
                {
                    name: 'uniqueLoaderId',
                    dataType: ['text'],
                },
                {
                    name: 'source',
                    dataType: ['text'],
                },
            ],
            vectorIndexConfig: {
                distance: 'cosine',
            },
        })
            .do();
    }
    async insertChunks(chunks) {
        let processed = 0;
        const batcher = this.client.batch.objectsBatcher();
        for (let i = 0; i < chunks.length; i += WeaviateDb.WEAVIATE_INSERT_CHUNK_SIZE) {
            const chunkBatch = chunks.slice(i, i + WeaviateDb.WEAVIATE_INSERT_CHUNK_SIZE);
            this.debug(`Inserting Weaviate batch`);
            const result = await batcher
                .withObjects(...chunkBatch.map((chunk) => {
                const chunkId = chunk.metadata.id;
                delete chunk.metadata.id;
                return {
                    class: this.className,
                    id: generateUuid5(chunkId),
                    vector: chunk.vector,
                    properties: {
                        uniqueLoaderId: chunk.metadata.uniqueLoaderId,
                        pageContent: chunk.pageContent,
                        ...chunk.metadata,
                    },
                };
            }))
                .do();
            this.debug('Weaviate errors', result.map((r) => r.result?.errors?.error?.[0].message ?? 'NONE'));
            processed += chunkBatch.length;
        }
        return processed;
    }
    async similaritySearch(query, k) {
        const queryResponse = await this.client.graphql
            .get()
            .withClassName(this.className)
            .withNearVector({ vector: query })
            .withFields('uniqueLoaderId pageContent source')
            .withLimit(k)
            .do();
        return queryResponse.data.Get[this.className].map((match) => {
            const pageContent = match.pageContent;
            delete match.pageContent;
            return {
                pageContent,
                metadata: match,
            };
        });
    }
    async getVectorCount() {
        const queryResponse = await this.client.graphql
            .aggregate()
            .withClassName(this.className)
            .withFields('meta { count }')
            .do();
        return queryResponse.data.Aggregate[this.className][0].meta.count;
    }
    async deleteKeys(uniqueLoaderId) {
        await this.client.batch
            .objectsBatchDeleter()
            .withClassName(this.className)
            .withWhere({
            path: ['uniqueLoaderId'],
            operator: 'ContainsAny',
            valueTextArray: [uniqueLoaderId],
        })
            .do();
        return true;
    }
    async reset() {
        await this.client.schema.classDeleter().withClassName(this.className).do();
        await this.init({ dimensions: this.dimensions });
    }
}
WeaviateDb.WEAVIATE_INSERT_CHUNK_SIZE = 500;