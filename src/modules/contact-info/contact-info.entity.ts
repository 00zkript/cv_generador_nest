import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ContactInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    linkedIn: string;

    @Column({ nullable: true })
    github: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    address: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}