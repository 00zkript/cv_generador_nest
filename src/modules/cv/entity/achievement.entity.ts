import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
// import { WorkExperience } from './work-experience.entity';

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    work_experience_id: number;

    @Column()
    description: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // @ManyToOne(() => WorkExperience, (workExperience) => workExperience.achievements, { onDelete: 'SET NULL' })
    // @JoinColumn({ name: 'work_experience_id' })
    // work_experience: Relation<WorkExperience>;
}