import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Experience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company: string;

    @Column()
    position: string;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    location: string;

    @ManyToOne(() => User, user => user.experiences)
    user: User;
}