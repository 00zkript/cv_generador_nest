import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reference } from './reference.entity';

@Injectable()
export class ReferencesService {
    constructor(
        @Inject('REFERENCES_REPOSITORY')
        private referenceRepository: Repository<Reference>
    ) {}

    async create(reference: Partial<Reference>): Promise<Reference> {
        const newReference = this.referenceRepository.create(reference);
        return await this.referenceRepository.save(newReference);
    }

    async findAll(userId: number): Promise<Reference[]> {
        return await this.referenceRepository.find({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }

    async findOne(id: number): Promise<Reference|null> {
        return await this.referenceRepository.findOne({
            where: { id },
            relations: ['user']
        });
    }

    async update(id: number, reference: Partial<Reference>): Promise<Reference|null> {
        await this.referenceRepository.update(id, reference);
        return await this.referenceRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.referenceRepository.delete(id);
    }
}