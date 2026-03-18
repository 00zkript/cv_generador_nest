import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiCompletionResponse } from '../interfaces/ai-service.interface';
import { AiRequest, IAiService } from '../interfaces/ai-service.interface';

@Injectable()
export class DeepSeekAiService implements IAiService {
    private readonly logger = new Logger(DeepSeekAiService.name);
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || '';

        if (!apiKey) {
            this.logger.warn('DEEPSEEK_API_KEY no está configurada');
        }

        this.openai = new OpenAI({
            apiKey,
            baseURL: 'https://api.deepseek.com',
        });
    }

    async generateCvContent(request: AiRequest): Promise<AiCompletionResponse> {
        const response = await this.openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: request.systemPrompt },
                { role: 'user', content: request.userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        return {
            content: response.choices[0]?.message?.content || '',
            usage: { total_tokens: response.usage?.total_tokens },
        };
    }

    async generateSummary(request: AiRequest): Promise<AiCompletionResponse> {
        return this.generateCvContent(request);
    }
}
