import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_projects')
export class UserProject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ name: 'project_url', nullable: true })
    project_url!: string;

    @Column({ name: 'github_url', nullable: true })
    github_url!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, user => user.projects)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
