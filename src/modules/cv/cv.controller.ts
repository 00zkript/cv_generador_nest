import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UsePipes } from "@nestjs/common";
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CvService } from "./cv.service";
import { Response } from "express";
import { Readable } from "stream";
import { CreateCvDto } from "./dto/create-cv.dto";
import { UpdateCvDto } from "./dto/update-cv.dto";
import { ResponseCvDto } from "./dto/response-cv.dto";
import { PaginateCvDto } from "./dto/paginate-cv.dto";

@ApiTags('cvs')
@Controller('cvs')
@UsePipes(ZodValidationPipe)
export class CvController {

    constructor(
        private readonly cvService: CvService
    ) { }

    @ApiOperation({ summary: 'Obtener todos los cvs' })
    @ApiOkResponse({ type: [ResponseCvDto] })
    @Get()
    index() {
        return this.cvService.getAll();
    }


    @ApiOperation({ summary: 'Obtener todos los cvs' })
    @ApiOkResponse({ type: [PaginateCvDto] })
    @Get('paginate')
    paginate(@Query('page') page: number, @Query('per_page') perPage: number) {
        return this.cvService.paginate(+page, +perPage);
    }

    @ApiOperation({ summary: 'Obtener un cv' })
    @ApiOkResponse({ type: ResponseCvDto })
    @Get(':id')
    show(@Param('id') id: number) {
        try {

            return this.cvService.find(+id);
        }catch (error) {
            console.error('Error in show method:', error);
        }
    }

    @ApiOperation({ summary: 'Crear un cv' })
    @ApiCreatedResponse({ type: ResponseCvDto })
    @Post()
    store(@Body() data: CreateCvDto) {
        return this.cvService.store(data);
    }

    @ApiOperation({ summary: 'Actualizar un cv' })
    @ApiAcceptedResponse({ type: ResponseCvDto })
    @Put(':id')
    update(@Param('id') id: number, @Body() data: UpdateCvDto) {
        return this.cvService.update(id, data);
    }

    @ApiOperation({ summary: 'Eliminar un cv' })
    @ApiOkResponse({ type: ResponseCvDto })
    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.cvService.delete(id);
    }

    @ApiOperation({ summary: 'Duplicar un cv' })
    @ApiCreatedResponse({ type: ResponseCvDto })
    @Post(':id/duplicate')
    duplicate(@Param('id') id: number) {
        return this.cvService.duplicate(id);
    }

    @ApiOperation({ summary: 'Obtener el pdf de un cv' })
    @Get(':id/pdf')
    async pdf(@Param('id') id: number, @Res() res: Response) {
        const pdfBuffer = await this.cvService.getPdf(id);

        const stream = new Readable();
        stream.push(pdfBuffer);
        stream.push(null);

        res.set({
            'Content-Type': 'application/pdf',
            // 'Content-Disposition': `attachment; filename="archivo-${id}.pdf"`,
            'Content-Disposition': `inline; filename="cv-${id}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        // res.send(pdfBuffer);
        stream.pipe(res);
    }


}