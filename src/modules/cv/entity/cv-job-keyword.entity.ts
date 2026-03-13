import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('cv_job_keywords')
export class CvJobKeyword {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'cv_id', nullable: true })
    cv_id!: number;

    @Column({ nullable: true })
    keyword!: string;

    @Column({ nullable: true })
    weight!: number;

    @ManyToOne(() => Cv, cv => cv.job_keywords)
    @JoinColumn({ name: 'cv_id' })
    cv!: Cv;
}
