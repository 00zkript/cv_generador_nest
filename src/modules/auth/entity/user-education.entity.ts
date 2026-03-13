import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_education')
export class UserEducation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    institution!: string;

    @Column({ nullable: true })
    degree!: string;

    @Column({ name: 'field_of_study', nullable: true })
    field_of_study!: string;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    start_date!: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    end_date!: Date;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, user => user.education)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
