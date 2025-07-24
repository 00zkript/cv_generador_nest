import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Relation } from 'typeorm';
import { Cv } from './cv.entity';
// import { Achievement } from './achievement.entity';

@Entity('works_experiences')
export class WorkExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cv_id: number;

    @Column({ length: 250 })
    name: string;

    @Column({ length: 250 })
    company: string;

    @Column({ length: 250 })
    position: string;

    @Column({ type: 'date' })
    start_date: string;

    @Column({ type: 'date' })
    end_date: string;

    @Column({ default: false })
    current: boolean;

    @Column({ length: 250 })
    description: string;

    @Column({ length: 250 })
    city: string;

    @Column({ length: 250 })
    country: string;

    @Column({ name: 'achievements', type: 'text', nullable: true })
    achievements: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Cv, cv => cv.works_experiences)
    @JoinColumn({ name: 'cv_id' })
    cv: Cv;

    // @OneToMany(() => Achievement, achievement => achievement.work_experience, { cascade: true })
    // achievements: Relation<Achievement[]>;
}