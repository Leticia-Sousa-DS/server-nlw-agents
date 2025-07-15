import { and, eq, sql } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
    app.post('/rooms/:roomId/questions', {
        schema: {
            params: z.object({
                roomId: z.string(),
            }),
            body: z.object({
                question: z.string().min(1),
            }),
        },
    }, 
    async(request, reply) =>{
        const { roomId } = request.params
        const { question } = request.body

        const embeddings = await generateEmbeddings(question)

        const embeddingsAsString = `[${embeddings.join(',')}]`

        const clips = await db
            .select({
                id: schema.audioClips.id,
                transcription:  schema.audioClips.transcription,
                similarity: sql<number>`1 - (${schema.audioClips.embeddings} <=> ${embeddingsAsString}::vector)`,
            }
            )
            .from(schema.audioClips)
            .where(
                and(
                eq(schema.audioClips.roomId, roomId),
                    sql`1 - (${schema.audioClips.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
                )
            )
            .orderBy(
                sql`${schema.audioClips.embeddings} <=> ${embeddingsAsString}::vector`
            )
            .limit(3)

        let answer: string | null = null

        if(clips.length > 0){
            const transcription = clips.map((clip) => clip.transcription)

            answer = await generateAnswer(question, transcription)
        }

        const result = await db
        .insert(schema.questions)
        .values({ roomId, question, answer})
        .returning()

        const insertedQuestion= result[0]

        if(!insertedQuestion){
            throw new Error('Failed to create new room.')
        }

        return reply.status(201).send({ 
            roomId: insertedQuestion.id,
            answer,
        })

    })
}