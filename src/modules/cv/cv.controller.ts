import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { Body, Controller, Delete, Get, Param, Post, Put, Res, UsePipes } from "@nestjs/common";
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CvService } from "./cv.service";
import { CvDto, RequestCvDto } from "./schemas/cv.schema";
import { Response } from "express";
import { Readable } from "stream";

@ApiTags('cvs')
@Controller('cvs')
@UsePipes(ZodValidationPipe)
export class CvController {

    constructor(
        private readonly cvService: CvService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los cvs' })
    @ApiOkResponse({
        description: 'Retorna todos los cvs',
        type: [CvDto]
    })
    @ApiBadRequestResponse({
        description: 'Error al obtener los cvs',
        type: Error
    })
    index() {
        return this.cvService.getCvs();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un cv' })
    @ApiOkResponse({
        description: 'Retorna un cv',
        type: CvDto
    })
    @ApiBadRequestResponse({
        description: 'Error al obtener el cv',
        type: Error
    })
    show(@Param('id') id: number) {
        return this.cvService.getCv(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un cv' })
    @ApiCreatedResponse({
        description: 'Cv creado',
        type: CvDto
    })
    store(@Body() data: RequestCvDto) {
        return this.cvService.storeCv(data);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un cv' })
    @ApiAcceptedResponse({
        description: 'Cv actualizado',
        type: CvDto
    })
    update(@Param('id') id: number, @Body() data: RequestCvDto) {
        return this.cvService.updateCv(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un cv' })
    @ApiOkResponse({
        description: 'Cv eliminado',
        type: CvDto
    })
    destroy(@Param('id') id: number) {
        return this.cvService.deleteCv(id);
    }

    @Post(':id/duplicate')
    @ApiOperation({ summary: 'Duplicar un cv' })
    @ApiCreatedResponse({
        description: 'Cv duplicado',
        type: CvDto
    })
    duplicate(@Param('id') id: number) {
        return this.cvService.duplicateCv(id);
    }

    @Get(':id/pdf')
    @ApiOperation({ summary: 'Obtener el pdf de un cv' })
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