import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserExperience } from './user-experience.entity';

@Entity('user_experience_achievements')
export class UserExperienceAchievement {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'experience_id', nullable: true })
    experience_id!: number;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => UserExperience, experience => experience.achievements)
    @JoinColumn({ name: 'experience_id' })
    experience!: UserExperience;
}
