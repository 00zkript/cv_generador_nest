import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { PdfService } from './pdf.service';
import { CvController } from './cv.controller';
import { Cv } from './entity/cv.entity';
import { CvJobKeyword } from './entity/cv-job-keyword.entity';
import { CvVersion } from './entity/cv-version.entity';
import { CvExport } from './entity/cv-export.entity';
import { CvTemplate } from './entity/cv-template.entity';
import { AiPromptLog } from './entity/ai-prompt-log.entity';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Cv,
            CvJobKeyword,
            CvVersion,
            CvExport,
            CvTemplate,
            AiPromptLog,
        ]),
        AiModule,
        AuthModule,
    ],
    controllers: [CvController],
    providers: [CvService, PdfService],
    exports: [CvService, PdfService],
})
export class CvModule {}
