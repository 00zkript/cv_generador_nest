import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { DeepSeekAiService } from './services/deepseek-ai.service';
import { OpenAiAiService } from './services/openai-ai.service';
import { AiServiceSelector } from './services/ai-service-selector';

@Module({
    providers: [
        AiService,
        DeepSeekAiService,
        OpenAiAiService,
        AiServiceSelector,
    ],
    exports: [AiService],
})
export class AiModule {}
