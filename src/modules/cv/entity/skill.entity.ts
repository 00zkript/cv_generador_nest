import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cv_id: number;

    @Column({ length: 250 })
    name: string;

    @Column({ length: 250 })
    time_level: string;

    @Column()
    description: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Cv, cv => cv.skills)
    @JoinColumn({ name: 'cv_id' })
    cv: Cv;
}