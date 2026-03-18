import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeepSeekAiService } from './deepseek-ai.service';
import { OpenAiAiService } from './openai-ai.service';
import { IAiService, AI_SERVICE_TOKEN } from '../interfaces/ai-service.interface';

@Injectable()
export class AiServiceSelector {
    private readonly logger = new Logger(AiServiceSelector.name);

    constructor(
        private configService: ConfigService,
        private deepSeekService: DeepSeekAiService,
        private openAiService: OpenAiAiService,
    ) {}

    getAiService(): IAiService {
        const providerType = this.configService.get<string>('AI_PROVIDER') || 'deepseek';

        this.logger.log(`Seleccionando servicio de IA: ${providerType}`);

        switch (providerType) {
            case 'openai':
                return this.openAiService;
            case 'deepseek':
            default:
                return this.deepSeekService;
        }
    }
}
