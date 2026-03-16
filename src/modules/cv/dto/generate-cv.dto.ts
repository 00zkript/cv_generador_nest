import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateCvDto {
    @ApiProperty({ example: 'Full Stack Developer' })
    @IsString()
    @IsNotEmpty()
    target_role!: string;

    @ApiProperty({ example: 'TechCorp Inc.' })
    @IsString()
    @IsNotEmpty()
    target_company!: string;

    @ApiProperty({ example: 'We are looking for a Full Stack Developer with experience in React, Node.js, TypeScript...' })
    @IsString()
    @IsNotEmpty()
    job_description!: string;

    @ApiProperty({ example: 'Software Engineer CV', required: false })
    @IsString()
    @IsOptional()
    title?: string;
}

export class GenerateCvResponseDto {
    @ApiProperty()
    cv_id!: number;

    @ApiProperty()
    version_id!: number;

    @ApiProperty()
    target_role!: string;

    @ApiProperty()
    target_company!: string;

    @ApiProperty()
    generated_data!: Record<string, unknown>;

    @ApiProperty()
    created_at!: Date;
}
