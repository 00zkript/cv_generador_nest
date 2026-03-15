import { IsString, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCvDto {
    @ApiProperty({ example: 'Software Engineer CV', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Full Stack Developer', required: false })
    @IsString()
    @IsOptional()
    target_role?: string;

    @ApiProperty({ example: 'Google', required: false })
    @IsString()
    @IsOptional()
    target_company?: string;

    @ApiProperty({ example: 'Looking for a developer with React and Node.js experience...', required: false })
    @IsString()
    @IsOptional()
    job_description?: string;
}

export class UpdateCvDto {
    @ApiProperty({ example: 'Updated CV Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Senior Developer', required: false })
    @IsString()
    @IsOptional()
    target_role?: string;

    @ApiProperty({ example: 'Amazon', required: false })
    @IsString()
    @IsOptional()
    target_company?: string;

    @ApiProperty({ example: 'Job description...', required: false })
    @IsString()
    @IsOptional()
    job_description?: string;
}

export class CvJobKeywordDto {
    @ApiProperty({ example: 'JavaScript' })
    @IsString()
    keyword!: string;

    @ApiProperty({ example: 8, required: false })
    @IsNumber()
    @Min(0)
    @Max(10)
    @IsOptional()
    weight?: number;
}

export class CvVersionDto {
    @ApiProperty({ example: '<div>CV Content...</div>', required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: 'gpt-4', required: false })
    @IsString()
    @IsOptional()
    generated_with?: string;

    @ApiProperty({ example: 85, required: false })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    ats_score?: number;
}

export class CreateFullCvDto {
    @ValidateNested()
    @Type(() => CreateCvDto)
    @IsOptional()
    @ApiProperty({ type: CreateCvDto, required: false })
    cv?: CreateCvDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CvJobKeywordDto)
    @IsOptional()
    @ApiProperty({ type: [CvJobKeywordDto], required: false })
    job_keywords?: CvJobKeywordDto[];

    @ValidateNested()
    @Type(() => CvVersionDto)
    @IsOptional()
    @ApiProperty({ type: CvVersionDto, required: false })
    version?: CvVersionDto;
}
