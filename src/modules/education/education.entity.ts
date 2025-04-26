import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    institution: string;

    @Column()
    degree: string;

    @Column()
    field: string;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    grade: string;

    @ManyToOne(() => User, user => user.education)
    user: User;
}