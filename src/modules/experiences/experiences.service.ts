import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';

@Injectable()
export class ExperiencesService {
    constructor(
        @Inject('EXPERIENCES_REPOSITORY')
        private experiencesRepository: Repository<Experience>,
    ) {}

    create(experience: Experience): Promise<Experience> {
        return this.experiencesRepository.save(experience);
    }

    findAll(): Promise<Experience[]> {
        return this.experiencesRepository.find();
    }

    findOne(id: number): Promise<Experience|null> {
        return this.experiencesRepository.findOne({ where: { id } });
    }

    findByUser(userId: number): Promise<Experience[]> {
        return this.experiencesRepository.find({
            where: { user: { id: userId } },
            order: { startDate: 'DESC' }
        });
    }

    async update(id: number, experience: Experience): Promise<Experience|null> {
        await this.experiencesRepository.update(id, experience);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.experiencesRepository.delete(id);
    }
}