import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    cv_id: number;

    @Column({ length: 250 })
    name: string;

    @Column({ length: 250 })
    last_name: string;

    @Column({ length: 250, nullable: true })
    phone: string;

    @Column({ length: 250, nullable: true })
    email: string;

    @Column({ nullable: true })
    linkedin: string;

    @Column({ nullable: true })
    github: string;

    @Column({ nullable: true })
    portafolio: string;

    @Column({ length: 250, nullable: true })
    city: string;

    @Column({ length: 250, nullable: true })
    country: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Cv, cv => cv.contact, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'cv_id' })
    cv: Cv;
}