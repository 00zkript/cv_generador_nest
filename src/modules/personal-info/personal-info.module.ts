import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalInfoController } from './personal-info.controller';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfo } from './personal-info.entity';
import { personalInfoProviders } from './personal-info.providers';

@Module({
    imports: [TypeOrmModule.forFeature([PersonalInfo])],
    controllers: [PersonalInfoController],
    providers: [
        ...personalInfoProviders,
        PersonalInfoService
    ],
    exports: [PersonalInfoService]
})
export class PersonalInfoModule {}