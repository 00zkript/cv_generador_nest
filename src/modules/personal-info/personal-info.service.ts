import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PersonalInfo } from './personal-info.entity';

@Injectable()
export class PersonalInfoService {
    constructor(
        @Inject('PERSONAL_INFO_REPOSITORY')
        private personalInfoRepository: Repository<PersonalInfo>
    ) {}

    async create(personalInfo: Partial<PersonalInfo>): Promise<PersonalInfo> {
        const newPersonalInfo = this.personalInfoRepository.create(personalInfo);
        return this.personalInfoRepository.save(newPersonalInfo);
    }

    async findByUserId(userId: number): Promise<PersonalInfo|null>  {
        return await this.personalInfoRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }

    async update(id: number, personalInfo: Partial<PersonalInfo>): Promise<PersonalInfo|null> {
        await this.personalInfoRepository.update(id, personalInfo);
        return await this.personalInfoRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.personalInfoRepository.delete(id);
    }
}