import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    headline!: string;

    @Column({ type: 'text', nullable: true })
    about!: string;

    @Column({ nullable: true })
    phone!: string;

    @Column({ nullable: true })
    location!: string;

    @Column({ name: 'linkedin_url', nullable: true })
    linkedin_url!: string;

    @Column({ name: 'github_url', nullable: true })
    github_url!: string;

    @Column({ name: 'portfolio_url', nullable: true })
    portfolio_url!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToOne(() => User, user => user.profile)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
