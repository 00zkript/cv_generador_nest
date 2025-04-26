import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('personal_info')
export class PersonalInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    summary: string;

    @Column({ nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true })
    nationality: string;

    @Column({ nullable: true })
    location: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}