import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { DatabaseModule } from '@/databases/database.module';

@Module({
    imports: [
        // TypeOrmModule.forFeature([
        //     Cv,
        //     CvJobKeyword,
        //     CvVersion,
        //     CvExport,
        //     CvTemplate,
        //     AiPromptLog,
        // ]),
        DatabaseModule
    ],
    controllers: [CvController],
    providers: [CvService],
    exports: [CvService],
})
export class CvModule {}
