
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class PageOptionsDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

export abstract class PaginateDto<T> {

    @ApiProperty({ example: 100 })
    total?: number

    @ApiProperty({ example: 10 })
    per_page?: number

    @ApiProperty({ example: 1 })
    current_page?: number

    @ApiProperty({ example: 10 })
    last_page?: number

    @ApiProperty({ example: 10 })
    total_pages?: number

    @ApiProperty({ example: 1 })
    from?: number

    @ApiProperty({ example: 10 })
    to?: number

    @ApiProperty({ type: () => Object, isArray: true })
    data?: T[]
}