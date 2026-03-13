import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../auth/entity/user.entity';
import { CvJobKeyword } from './cv-job-keyword.entity';
import { CvVersion } from './cv-version.entity';

@Entity('cvs')
export class Cv {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    user_id!: number;

    @Column({ nullable: true })
    title!: string;

    @Column({ name: 'target_role', nullable: true })
    target_role!: string;

    @Column({ name: 'target_company', nullable: true })
    target_company!: string;

    @Column({ name: 'job_description', type: 'text', nullable: true })
    job_description!: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at!: Date;

    @ManyToOne(() => User, user => user.cvs, { nullable: true })
    user!: User;

    @OneToMany(() => CvJobKeyword, keyword => keyword.cv, { cascade: true })
    job_keywords!: CvJobKeyword[];

    @OneToMany(() => CvVersion, version => version.cv, { cascade: true })
    versions!: CvVersion[];
}
