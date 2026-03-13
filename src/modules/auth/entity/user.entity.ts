import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
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

    @Column({ nullable: true })
    lastname!: string;

    @Column({ default: true })
    status!: boolean;

    @Column({ nullable: true })
    linkedin!: string;

    @Column({ nullable: true })
    github!: string;

    @Column({ nullable: true })
    twitter!: string;

    @Column({ nullable: true })
    portfolio!: string;

    @Column({ type: 'text', nullable: true })
    about_me!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Cv, cv => cv.user)
    cvs!: Cv[];
}
