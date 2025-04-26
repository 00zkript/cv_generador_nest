import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { skillsProviders } from './skills.providers';

@Module({
    controllers: [SkillsController],
    providers: [
        ...skillsProviders,
        SkillsService
    ],
    exports: [SkillsService]
})
export class SkillsModule {}