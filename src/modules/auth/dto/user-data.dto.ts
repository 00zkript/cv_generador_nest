import { IsString, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, IsBoolean, IsEnum, Min, Max, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export enum SkillLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
    EXPERT = 'expert',
}

export enum SkillCategory {
    PROGRAMMING_LANGUAGE = 'programming_language',
    FRAMEWORK = 'framework',
    TOOL = 'tool',
    SOFT_SKILL = 'soft_skill',
    DATABASE = 'database',
    DEVOPS = 'devops',
    OTHER = 'other',
}

export class ProfileDto {
    @IsString()
    @IsOptional()
    headline?: string;

    @IsString()
    @IsOptional()
    about?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsUrl()
    @IsOptional()
    linkedin_url?: string;

    @IsUrl()
    @IsOptional()
    github_url?: string;

    @IsUrl()
    @IsOptional()
    portfolio_url?: string;
}

export class SkillDto {
    @IsString()
    name!: string;

    @IsEnum(SkillLevel)
    @IsOptional()
    level?: SkillLevel;

    @IsNumber()
    @Min(0)
    @Max(50)
    @IsOptional()
    years_experience?: number;

    @IsEnum(SkillCategory)
    @IsOptional()
    category?: SkillCategory;
}

export class ExperienceDto {
    @IsString()
    company!: string;

    @IsString()
    role!: string;

    @IsDateString()
    @IsOptional()
    start_date?: string;

    @IsDateString()
    @IsOptional()
    end_date?: string;

    @IsBoolean()
    @IsOptional()
    is_current?: boolean;

    @IsString()
    @IsOptional()
    description?: string;
}

export class EducationDto {
    @IsString()
    institution!: string;

    @IsString()
    @IsOptional()
    degree?: string;

    @IsString()
    @IsOptional()
    field_of_study?: string;

    @IsDateString()
    @IsOptional()
    start_date?: string;

    @IsDateString()
    @IsOptional()
    end_date?: string;
}

export class ProjectDto {
    @IsString()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    project_url?: string;

    @IsUrl()
    @IsOptional()
    github_url?: string;

    @IsDateString()
    @IsOptional()
    start_date?: string;

    @IsDateString()
    @IsOptional()
    end_date?: string;
}

export class UserDataDto {
    @ValidateNested()
    @Type(() => ProfileDto)
    @IsOptional()
    profile?: ProfileDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SkillDto)
    @IsOptional()
    skills?: SkillDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    @IsOptional()
    experiences?: ExperienceDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    @IsOptional()
    education?: EducationDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectDto)
    @IsOptional()
    projects?: ProjectDto[];
}

export class UpdateProfileDto extends ProfileDto {}
export class CreateSkillDto extends SkillDto {}
export class UpdateSkillDto extends SkillDto {}
export class CreateExperienceDto extends ExperienceDto {}
export class UpdateExperienceDto extends ExperienceDto {}
export class CreateEducationDto extends EducationDto {}
export class UpdateEducationDto extends EducationDto {}
export class CreateProjectDto extends ProjectDto {}
export class UpdateProjectDto extends ProjectDto {}
