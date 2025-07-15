import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core'
import { rooms } from './rooms.ts'

export const audioClips = pgTable('audio_clips', {
    id: uuid().primaryKey().defaultRandom(),
    roomId: uuid()
    .references(()=> rooms.id)
    .notNull(),
    transcription: text().notNull(),
    embeddings: vector({ dimensions: 768 }).notNull(),
    createdAt: timestamp().defaultNow().notNull()
})