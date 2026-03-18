export interface AiCompletionResponse {
    content: string;
    usage?: {
        total_tokens?: number;
    };
}

export interface AiModelConfig {
    model: string;
    temperature?: number;
    max_tokens?: number;
}

export interface AiRequest {
    systemPrompt: string;
    userPrompt: string;
    config?: AiModelConfig;
}

export interface IAiService {
    generateCvContent(request: AiRequest): Promise<AiCompletionResponse>;
    generateSummary(request: AiRequest): Promise<AiCompletionResponse>;
}

export const AI_SERVICE_TOKEN = {
    DEEPSEEK: 'DEEPSEEK_AI_SERVICE',
    OPENAI: 'OPENAI_AI_SERVICE',
    DEFAULT: 'AI_SERVICE',
} as const;
