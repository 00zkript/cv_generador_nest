
import { ApiProperty } from "@nestjs/swagger";

export abstract class PaginateDto<T> {

    @ApiProperty()
    total?: number

    @ApiProperty()
    per_page?: number

    @ApiProperty()
    current_page?: number

    @ApiProperty()
    last_page?: number

    @ApiProperty()
    total_pages?: number

    @ApiProperty()
    from?: number

    @ApiProperty()
    to?: number

    @ApiProperty({ type: () => Object, isArray: true })
    data?: T[]
}