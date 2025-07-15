import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

export async function transcribeAudio(audioAsBase64: string, mimeType: string){
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: 'Transcreva o áudio para Português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for necessário.'
            },
            {
                inlineData: {
                    mimeType,
                    data: audioAsBase64,
                },
            }
        ],
    })

    if(!response.text) {
        throw new Error("Não foi possível conerter o áudio")
    }

    return response.text

}

export async function generateEmbeddings(text: string){
    const response = await gemini.models.embedContent({
        model: 'text-embedding-004',
        contents: [{ text }],
        config: {
            taskType: 'RETRIEVAL_DOCUMENT'
        }
    })

    if(!response.embeddings?.[0].values){
        throw new Error('Não foi possível gerar os embeddings.')
    }

    return response.embeddings[0].values

} 

export async function generateAnswer(question: string, transcription: string[]){
    const context = transcription.join("\n\n")

    const prompt = `
        Com base no texto fornecido como contexto, responda a pergunta de forma clara, coesa e assertiva em português do Brasil.
    
        CONTEXTO:
        ${context} 

        PERGUNTA:
        ${question}

        INSTRUÇÕES:
        - Use apenas informações contidas no contexto enviado;
        - Se a resposta não for encontrada no contexto, apenas informe que não há informações suficientes para responder apropriadamente;
        - Seja objetivo e preciso;
        - Mantenha um tom profissional e didático;
        - Cite trechos relevantes do contexto somente quando for apropriado;
        - Caso cite o contexto, utilize o termo "conteúdo da aula";
        `.trim()

    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt
            }
        ]
    })

    if(!response.text){
        throw new Error('Falha ao gerar resposta pelo Google Gemini')
    }

    return response.text
}