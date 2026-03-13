import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { UserSkill } from './user-skill.entity';
import { UserExperience } from './user-experience.entity';
import { UserEducation } from './user-education.entity';
import { UserProject } from './user-project.entity';
import { Cv } from '../../cv/entity/cv.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    name!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToOne(() => UserProfile, profile => profile.user, { cascade: true })
    profile!: UserProfile;

    @OneToMany(() => UserSkill, skill => skill.user, { cascade: true })
    skills!: UserSkill[];

    @OneToMany(() => UserExperience, experience => experience.user, { cascade: true })
    experiences!: UserExperience[];

    @OneToMany(() => UserEducation, education => education.user, { cascade: true })
    education!: UserEducation[];

    @OneToMany(() => UserProject, project => project.user, { cascade: true })
    projects!: UserProject[];

    @OneToMany(() => Cv, cv => cv.user)
    cvs!: Cv[];
}
