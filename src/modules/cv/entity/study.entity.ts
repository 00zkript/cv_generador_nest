import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('studies')
export class Study {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cv_id: number;

    @Column({ length: 250 })
    center_study: string;

    @Column({ length: 250 })
    title: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    description: string;

    @Column({ length: 250 })
    city: string;

    @Column({ length: 250 })
    country: string;

    @Column({ default: false })
    current: boolean;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Cv, cv => cv.studies)
    @JoinColumn({ name: 'cv_id' })
    cv: Cv;
}