import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cv } from './cv.entity';
import { CvExport } from './cv-export.entity';

@Entity('cv_versions')
export class CvVersion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'cv_id', nullable: true })
    cv_id!: number;

    @Column({ name: 'version_number', nullable: true })
    version_number!: number;

    @Column({ name: 'prompt_used', type: 'text', nullable: true })
    prompt_used!: string;

    @Column({ name: 'content_json', type: 'jsonb', nullable: true })
    content_json!: Record<string, unknown>;

    @Column({ name: 'ats_score', type: 'numeric', nullable: true })
    ats_score!: number;

    @Column({ default: 0 })
    position!: number;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Cv, cv => cv.versions)
    @JoinColumn({ name: 'cv_id' })
    cv!: Cv;

    @ManyToOne(() => CvExport, cvExport => cvExport.cvVersion)
    exports!: CvExport[];
}
