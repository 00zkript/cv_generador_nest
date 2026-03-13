import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cv_templates')
export class CvTemplate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true })
    layout!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn()
    created_at!: Date;
}
