import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { UserExperienceAchievement } from './user-experience-achievement.entity';

@Entity('user_experiences')
export class UserExperience {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    company!: string;

    @Column({ nullable: true })
    role!: string;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    start_date!: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    end_date!: Date;

    @Column({ name: 'is_current', default: false })
    is_current!: boolean;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, user => user.experiences)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => UserExperienceAchievement, achievement => achievement.experience, { cascade: true })
    achievements!: UserExperienceAchievement[];
}
