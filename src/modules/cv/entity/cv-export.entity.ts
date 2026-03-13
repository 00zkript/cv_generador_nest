import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CvVersion } from './cv-version.entity';

@Entity('cv_exports')
export class CvExport {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'cv_version_id', nullable: true })
    cv_version_id!: number;

    @Column({ nullable: true })
    template!: string;

    @Column({ name: 'file_url', nullable: true })
    file_url!: string;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => CvVersion, cvVersion => cvVersion.exports)
    @JoinColumn({ name: 'cv_version_id' })
    cvVersion!: CvVersion;
}
