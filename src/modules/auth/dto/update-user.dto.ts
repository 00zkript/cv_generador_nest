import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'John', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Doe', required: false })
    @IsString()
    @IsOptional()
    lastname?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @ApiProperty({ example: 'https://linkedin.com/in/johndoe', required: false })
    @IsUrl()
    @IsOptional()
    linkedin?: string;

    @ApiProperty({ example: 'https://github.com/johndoe', required: false })
    @IsUrl()
    @IsOptional()
    github?: string;

    @ApiProperty({ example: 'https://twitter.com/johndoe', required: false })
    @IsUrl()
    @IsOptional()
    twitter?: string;

    @ApiProperty({ example: 'https://johndoe.dev', required: false })
    @IsUrl()
    @IsOptional()
    portfolio?: string;

    @ApiProperty({ example: 'Desarrollador con 5 años de experiencia...', required: false })
    @IsString()
    @IsOptional()
    about_me?: string;
}
