import { IsString, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, IsBoolean, IsEnum, Min, Max, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
    @ApiProperty({ example: 'Senior Full Stack Developer', required: false })
    @IsString()
    @IsOptional()
    headline?: string;

    @ApiProperty({ example: 'Passionate developer with 5+ years of experience...', required: false })
    @IsString()
    @IsOptional()
    about?: string;

    @ApiProperty({ example: '+1234567890', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'New York, USA', required: false })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({ example: 'https://linkedin.com/in/johndoe', required: false })
    @IsUrl()
    @IsOptional()
    linkedin_url?: string;

    @ApiProperty({ example: 'https://github.com/johndoe', required: false })
    @IsUrl()
    @IsOptional()
    github_url?: string;

    @ApiProperty({ example: 'https://johndoe.dev', required: false })
    @IsUrl()
    @IsOptional()
    portfolio_url?: string;
}

export class SkillDto {
    @ApiProperty({ example: 'TypeScript' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'expert', enum: SkillLevel, required: false })
    @IsEnum(SkillLevel)
    @IsOptional()
    level?: SkillLevel;

    @ApiProperty({ example: 5, required: false })
    @IsNumber()
    @Min(0)
    @Max(50)
    @IsOptional()
    years_experience?: number;

    @ApiProperty({ example: 'programming_language', enum: SkillCategory, required: false })
    @IsEnum(SkillCategory)
    @IsOptional()
    category?: SkillCategory;
}

export class ExperienceDto {
    @ApiProperty({ example: 'Tech Corp Inc.' })
    @IsString()
    company!: string;

    @ApiProperty({ example: 'Senior Developer' })
    @IsString()
    role!: string;

    @ApiProperty({ example: '2020-01-15', required: false })
    @IsDateString()
    @IsOptional()
    start_date?: string;

    @ApiProperty({ example: '2023-12-31', required: false })
    @IsDateString()
    @IsOptional()
    end_date?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    is_current?: boolean;

    @ApiProperty({ example: 'Led development of...', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class EducationDto {
    @ApiProperty({ example: 'MIT' })
    @IsString()
    institution!: string;

    @ApiProperty({ example: 'Bachelor of Science', required: false })
    @IsString()
    @IsOptional()
    degree?: string;

    @ApiProperty({ example: 'Computer Science', required: false })
    @IsString()
    @IsOptional()
    field_of_study?: string;

    @ApiProperty({ example: '2015-09-01', required: false })
    @IsDateString()
    @IsOptional()
    start_date?: string;

    @ApiProperty({ example: '2019-06-15', required: false })
    @IsDateString()
    @IsOptional()
    end_date?: string;
}

export class ProjectDto {
    @ApiProperty({ example: 'E-commerce Platform' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'Full-stack e-commerce solution built with...', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'https://myshop.com', required: false })
    @IsUrl()
    @IsOptional()
    project_url?: string;

    @ApiProperty({ example: 'https://github.com/johndoe/ecommerce', required: false })
    @IsUrl()
    @IsOptional()
    github_url?: string;

    @ApiProperty({ example: '2022-01-01', required: false })
    @IsDateString()
    @IsOptional()
    start_date?: string;

    @ApiProperty({ example: '2022-06-01', required: false })
    @IsDateString()
    @IsOptional()
    end_date?: string;
}

export class UserDataDto {
    @ValidateNested()
    @Type(() => ProfileDto)
    @IsOptional()
    @ApiProperty({ example: ProfileDto })
    profile?: ProfileDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SkillDto)
    @IsOptional()
    @ApiProperty({ example: [SkillDto] })
    skills?: SkillDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    @IsOptional()
    @ApiProperty({ example: [ExperienceDto] })
    experiences?: ExperienceDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    @IsOptional()
    @ApiProperty({ example: [EducationDto] })
    education?: EducationDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProjectDto)
    @IsOptional()
    @ApiProperty({ example: [ProjectDto] })
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
