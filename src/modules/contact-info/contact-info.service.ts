import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ContactInfo } from './contact-info.entity';

@Injectable()
export class ContactInfoService {
    constructor(
        @Inject('CONTACT_INFO_REPOSITORY')
        private contactInfoRepository: Repository<ContactInfo>
    ) {}

    async create(contactInfo: Partial<ContactInfo>): Promise<ContactInfo> {
        const newContactInfo = this.contactInfoRepository.create(contactInfo);
        return await this.contactInfoRepository.save(newContactInfo);
    }

    async findByUserId(userId: number): Promise<ContactInfo|null> {
        return await this.contactInfoRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }

    async update(id: number, contactInfo: Partial<ContactInfo>): Promise<ContactInfo|null> {
        await this.contactInfoRepository.update(id, contactInfo);
        return await this.contactInfoRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.contactInfoRepository.delete(id);
    }
}