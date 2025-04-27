import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('languages')
export class Language {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cv_id: number;

    @Column({ length: 250 })
    name: string;

    @Column({ length: 250 })
    nivel: string;

    @Column()
    description: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Cv, cv => cv.languages)
    @JoinColumn({ name: 'cv_id' })
    cv: Cv;
}