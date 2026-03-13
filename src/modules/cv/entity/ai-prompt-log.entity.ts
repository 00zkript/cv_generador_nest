import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('ai_prompt_logs')
export class AiPromptLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'cv_id', nullable: true })
    cv_id!: number;

    @Column({ type: 'text', nullable: true })
    prompt!: string;

    @Column({ type: 'jsonb', nullable: true })
    response!: Record<string, unknown>;

    @Column({ nullable: true })
    model!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Cv)
    @JoinColumn({ name: 'cv_id' })
    cv!: Cv;
}
