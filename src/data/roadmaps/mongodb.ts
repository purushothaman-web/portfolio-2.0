import { SkillRoadmap } from './types';
export const mongodbRoadmap: SkillRoadmap = {
        skillId: 'mongodb',
        skillName: 'MongoDB & Document Modeling',
        category: 'DATA STORAGE',
        tagline: 'Flexible document modeling, aggregation pipelines, compound indexing, and distributed clusters.',
        accentColor: '#15803d',
        officialDocs: [
            {
                title: 'MongoDB Official Documentation',
                url: 'https://www.mongodb.com/docs/',
                description: 'The authoritative reference for queries, indexes, and aggregation pipelines.',
                badge: 'Official Manual'
            },
            {
                title: 'MongoDB University Free Courses',
                url: 'https://learn.mongodb.com/',
                description: 'Free interactive labs and certification tracks on document modeling.',
                badge: 'Interactive Labs'
            }
        ],
        checkpoints: [
            {
                id: 'mongo-1',
                title: 'Embedding vs Referencing (1-to-N vs 1-to-Squillion)',
                estMinutes: 5,
                concept: {
                    summary: 'In MongoDB, embed child documents when the relationship has a bounded size (e.g. 1 user with 2 addresses). Reference with ObjectIds when the relationship is unbounded (e.g. 1 post with 1,000,000 logs).',
                    analogy: 'Keep your driver license in your wallet (embedded, bounded). Keep your car in a parking garage with a parking ticket number (referenced, unbounded).',
                    seniorInsight: 'MongoDB documents have a strict 16MB limit. Embedding an unbounded array will eventually corrupt the document or hit the 16MB ceiling.'
                },
                trap: {
                    title: 'Embedding unbounded arrays inside a parent document',
                    juniorCode: `// âŒ JUNIOR: Embedding infinite logs inside a single user document
const userSchema = new Schema({
    name: String,
    activityLogs: [{ action: String, timestamp: Date }] // Crashes when logs exceed 16MB!
});`,
                    seniorCode: `// âœ… SENIOR: Separate collection with parent reference and compound index
const logSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: String,
    timestamp: { type: Date, index: true }
});`,
                    explanation: 'Storing unbounded data inside a parent array degrades write performance (document re-allocation) and will eventually breach MongoDB 16MB BSON limit.'
                },
                drill: {
                    question: 'If an e-commerce order has 3 shipping updates, should the updates be embedded in the Order document or stored in a separate collection?',
                    hint: 'Consider whether an order can ever have 100,000 shipping updates.',
                    solution: `They should be EMBEDDED inside the Order document!
Explanation: An order typically has fewer than 10 tracking updates. Embedding allows fetching the complete order and tracking status in 1 single, atomic read operation.`,
                    explanation: 'Embedding bounded arrays (1-to-few) optimizes read latency and maintains atomicity without needing costly $lookup joins.'
                },
                docLink: {
                    title: 'MongoDB: Data Model Design',
                    url: 'https://www.mongodb.com/docs/manual/core/data-model-design/',
                    description: 'Official principles of document modeling and relationship strategies.'
                }
            }
        ]
};
