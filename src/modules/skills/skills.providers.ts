import { DataSource } from 'typeorm';
import { Skill } from './skill.entity';

export const skillsProviders = [
  {
    provide: 'SKILLS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Skill),
    inject: ['DATA_SOURCE'],
  },
];