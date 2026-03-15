import { IsString, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCvDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    target_role?: string;

    @IsString()
    @IsOptional()
    target_company?: string;

    @IsString()
    @IsOptional()
    job_description?: string;
}

export class UpdateCvDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    target_role?: string;

    @IsString()
    @IsOptional()
    target_company?: string;

    @IsString()
    @IsOptional()
    job_description?: string;
}

export class CvJobKeywordDto {
    @IsString()
    keyword!: string;

    @IsNumber()
    @Min(0)
    @Max(10)
    @IsOptional()
    weight?: number;
}

export class CvVersionDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    generated_with?: string;

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
    cv?: CreateCvDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CvJobKeywordDto)
    @IsOptional()
    job_keywords?: CvJobKeywordDto[];

    @ValidateNested()
    @Type(() => CvVersionDto)
    @IsOptional()
    version?: CvVersionDto;
}
