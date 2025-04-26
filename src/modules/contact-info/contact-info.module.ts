import { Module } from '@nestjs/common';
import { ContactInfoController } from './contact-info.controller';
import { ContactInfoService } from './contact-info.service';
import { contactInfoProviders } from './contact-info.providers';

@Module({
    controllers: [ContactInfoController],
    providers: [
        ...contactInfoProviders,
        ContactInfoService
    ],
    exports: [ContactInfoService]
})
export class ContactInfoModule {}