import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Education } from './education.entity';

@Injectable()
export class EducationService {
    constructor(
        @Inject('EDUCATION_REPOSITORY')
        private educationRepository: Repository<Education>,
    ) {}

    create(education: Education): Promise<Education> {
        return this.educationRepository.save(education);
    }

    findAll(): Promise<Education[]> {
        return this.educationRepository.find();
    }

    findOne(id: number): Promise<Education|null> {
        return this.educationRepository.findOne({ where: { id } });
    }

    findByUser(userId: number): Promise<Education[]> {
        return this.educationRepository.find({
            where: { user: { id: userId } },
            order: { startDate: 'DESC' }
        });
    }

    async update(id: number, education: Education): Promise<Education|null> {
        await this.educationRepository.update(id, education);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.educationRepository.delete(id);
    }
}