import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiCompletionResponse } from '../interfaces/ai-service.interface';
import { AiRequest, IAiService } from '../interfaces/ai-service.interface';

@Injectable()
export class OpenAiAiService implements IAiService {
    private readonly logger = new Logger(OpenAiAiService.name);
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';

        if (!apiKey) {
            this.logger.warn('OPENAI_API_KEY no está configurada');
        }

        this.openai = new OpenAI({
            apiKey,
        });
    }

    async generateCvContent(request: AiRequest): Promise<AiCompletionResponse> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
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
