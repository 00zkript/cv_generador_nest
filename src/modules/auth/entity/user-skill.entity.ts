import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_skills')
export class UserSkill {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true })
    level!: string;

    @Column({ name: 'years_experience', nullable: true })
    years_experience!: number;

    @Column({ nullable: true })
    category!: string;

    @Column({ default: 0 })
    position!: number;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, user => user.skills)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
