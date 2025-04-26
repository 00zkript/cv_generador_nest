import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';

@Injectable()
export class SkillsService {
    constructor(
        @Inject('SKILLS_REPOSITORY')
        private skillsRepository: Repository<Skill>,
    ) {}

    create(skill: Skill): Promise<Skill> {
        return this.skillsRepository.save(skill);
    }

    findAll(): Promise<Skill[]> {
        return this.skillsRepository.find();
    }

    findOne(id: number): Promise<Skill|null> {
        return this.skillsRepository.findOne({ where: { id } });
    }

    async update(id: number, skill: Skill): Promise<Skill|null> {
        await this.skillsRepository.update(id, skill);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.skillsRepository.delete(id);
    }
}