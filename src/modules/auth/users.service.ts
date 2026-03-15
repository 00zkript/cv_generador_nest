import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { UserProfile } from './entity/user-profile.entity';
import { UserSkill } from './entity/user-skill.entity';
import { UserExperience } from './entity/user-experience.entity';
import { UserEducation } from './entity/user-education.entity';
import { UserProject } from './entity/user-project.entity';
import { UserDataDto, ProfileDto, SkillDto, ExperienceDto, EducationDto, ProjectDto } from './dto/user-data.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private profileRepository: Repository<UserProfile>,
        @InjectRepository(UserSkill)
        private skillRepository: Repository<UserSkill>,
        @InjectRepository(UserExperience)
        private experienceRepository: Repository<UserExperience>,
        @InjectRepository(UserEducation)
        private educationRepository: Repository<UserEducation>,
        @InjectRepository(UserProject)
        private projectRepository: Repository<UserProject>,
        private dataSource: DataSource,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByIdWithRelations(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: {
                profile: true,
                skills: true,
                experiences: {
                    achievements: true
                },
                education: true,
                projects: true,
                cvs: true
            }
        });
    }

    async create(email: string, password: string, name?: string): Promise<User> {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            name,
        });

        return this.usersRepository.save(user);
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }

    async update(id: number, updateData: Partial<User>): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }

    async delete(id: number): Promise<void> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.usersRepository.delete(id);
    }

    async saveUserData(userId: number, data: UserDataDto): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (data.profile) {
                let profile = await this.profileRepository.findOne({ where: { user_id: userId } });
                if (profile) {
                    Object.assign(profile, data.profile);
                } else {
                    profile = this.profileRepository.create({ ...data.profile, user_id: userId });
                }
                await queryRunner.manager.save(profile);
            }

            if (data.skills) {
                await this.skillRepository.delete({ user_id: userId });
                const skills = data.skills.map(skill => 
                    this.skillRepository.create({ ...skill, user_id: userId })
                );
                await queryRunner.manager.save(skills);
            }

            if (data.experiences) {
                await this.experienceRepository.delete({ user_id: userId });
                const experiences = data.experiences.map(exp => {
                    const experience = this.experienceRepository.create({
                        ...exp,
                        user_id: userId,
                        start_date: exp.start_date ? new Date(exp.start_date) : undefined,
                        end_date: exp.end_date ? new Date(exp.end_date) : undefined,
                    });
                    return experience;
                });
                await queryRunner.manager.save(experiences);
            }

            if (data.education) {
                await this.educationRepository.delete({ user_id: userId });
                const education = data.education.map(edu => 
                    this.educationRepository.create({
                        ...edu,
                        user_id: userId,
                        start_date: edu.start_date ? new Date(edu.start_date) : undefined,
                        end_date: edu.end_date ? new Date(edu.end_date) : undefined,
                    })
                );
                await queryRunner.manager.save(education);
            }

            if (data.projects) {
                await this.projectRepository.delete({ user_id: userId });
                const projects = data.projects.map(proj => 
                    this.projectRepository.create({
                        title: proj.title,
                        description: proj.description,
                        project_url: proj.project_url,
                        github_url: proj.github_url,
                        user_id: userId,
                    })
                );
                await queryRunner.manager.save(projects);
            }

            await queryRunner.commitTransaction();
            const user = await this.findByIdWithRelations(userId);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getUserData(userId: number): Promise<User | null> {
        return this.findByIdWithRelations(userId);
    }

    async updateProfile(userId: number, profileData: ProfileDto): Promise<UserProfile> {
        let profile = await this.profileRepository.findOne({ where: { user_id: userId } });
        if (profile) {
            Object.assign(profile, profileData);
        } else {
            profile = this.profileRepository.create({ ...profileData, user_id: userId });
        }
        return this.profileRepository.save(profile);
    }

    async addSkill(userId: number, skillData: SkillDto): Promise<UserSkill> {
        const skill = this.skillRepository.create({ ...skillData, user_id: userId });
        return this.skillRepository.save(skill);
    }

    async updateSkill(skillId: number, userId: number, skillData: SkillDto): Promise<UserSkill> {
        const skill = await this.skillRepository.findOne({ where: { id: skillId, user_id: userId } });
        if (!skill) {
            throw new NotFoundException('Skill not found');
        }
        Object.assign(skill, skillData);
        return this.skillRepository.save(skill);
    }

    async deleteSkill(skillId: number, userId: number): Promise<void> {
        const result = await this.skillRepository.delete({ id: skillId, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Skill not found');
        }
    }

    async addExperience(userId: number, experienceData: ExperienceDto): Promise<UserExperience> {
        const experience = this.experienceRepository.create({
            ...experienceData,
            user_id: userId,
            start_date: experienceData.start_date ? new Date(experienceData.start_date) : undefined,
            end_date: experienceData.end_date ? new Date(experienceData.end_date) : undefined,
        });
        return this.experienceRepository.save(experience);
    }

    async updateExperience(experienceId: number, userId: number, experienceData: ExperienceDto): Promise<UserExperience> {
        const experience = await this.experienceRepository.findOne({ where: { id: experienceId, user_id: userId } });
        if (!experience) {
            throw new NotFoundException('Experience not found');
        }
        Object.assign(experience, experienceData, {
            start_date: experienceData.start_date ? new Date(experienceData.start_date) : experience.start_date,
            end_date: experienceData.end_date ? new Date(experienceData.end_date) : experience.end_date,
        });
        return this.experienceRepository.save(experience);
    }

    async deleteExperience(experienceId: number, userId: number): Promise<void> {
        const result = await this.experienceRepository.delete({ id: experienceId, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Experience not found');
        }
    }

    async addEducation(userId: number, educationData: EducationDto): Promise<UserEducation> {
        const education = this.educationRepository.create({
            ...educationData,
            user_id: userId,
            start_date: educationData.start_date ? new Date(educationData.start_date) : undefined,
            end_date: educationData.end_date ? new Date(educationData.end_date) : undefined,
        });
        return this.educationRepository.save(education);
    }

    async updateEducation(educationId: number, userId: number, educationData: EducationDto): Promise<UserEducation> {
        const education = await this.educationRepository.findOne({ where: { id: educationId, user_id: userId } });
        if (!education) {
            throw new NotFoundException('Education not found');
        }
        Object.assign(education, educationData, {
            start_date: educationData.start_date ? new Date(educationData.start_date) : education.start_date,
            end_date: educationData.end_date ? new Date(educationData.end_date) : education.end_date,
        });
        return this.educationRepository.save(education);
    }

    async deleteEducation(educationId: number, userId: number): Promise<void> {
        const result = await this.educationRepository.delete({ id: educationId, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Education not found');
        }
    }

    async addProject(userId: number, projectData: ProjectDto): Promise<UserProject> {
        const project = this.projectRepository.create({
            title: projectData.title,
            description: projectData.description,
            project_url: projectData.project_url,
            github_url: projectData.github_url,
            user_id: userId,
        });
        return this.projectRepository.save(project);
    }

    async updateProject(projectId: number, userId: number, projectData: ProjectDto): Promise<UserProject> {
        const project = await this.projectRepository.findOne({ where: { id: projectId, user_id: userId } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }
        Object.assign(project, {
            title: projectData.title,
            description: projectData.description,
            project_url: projectData.project_url,
            github_url: projectData.github_url,
        });
        return this.projectRepository.save(project);
    }

    async deleteProject(projectId: number, userId: number): Promise<void> {
        const result = await this.projectRepository.delete({ id: projectId, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Project not found');
        }
    }
}
