
import { ApiProperty } from "@nestjs/swagger";
import { CvDto } from "./cv.dto";

export class PaginateCvDto {

    @ApiProperty()
    total: number

    @ApiProperty()
    per_page: number

    @ApiProperty()
    current_page: number

    @ApiProperty()
    last_page: number

    @ApiProperty()
    total_pages: number

    // @ApiProperty()
    // from: number

    // @ApiProperty()
    // to: number

    @ApiProperty({ type: () => CvDto, isArray: true })
    data: CvDto[]



}