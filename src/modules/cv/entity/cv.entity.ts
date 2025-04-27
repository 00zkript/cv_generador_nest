import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Contact } from './contact.entity';
import { Language } from './language.entity';
import { Skill } from './skill.entity';
import { Study } from './study.entity';
import { WorkExperience } from './work-experience.entity';

@Entity('cvs')
export class Cv {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    subject: string;

    @Column({ length: 250 })
    version: string;

    @Column({ length: 250 })
    resume: string;

    @Column({ length: 20 })
    language: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Contact, contact => contact.cv, { cascade: true })
    contact: Contact;

    @OneToMany(() => Skill, skill => skill.cv, { cascade: true })
    skills: Skill[];

    @OneToMany(() => Study, study => study.cv, { cascade: true })
    studies: Study[];

    @OneToMany(() => Language, language => language.cv, { cascade: true })
    languages: Language[];

    @OneToMany(() => WorkExperience, workExperience => workExperience.cv, { cascade: true })
    works_experiences: WorkExperience[];
}