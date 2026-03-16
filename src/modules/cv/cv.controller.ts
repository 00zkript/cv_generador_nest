import { Controller, Delete, Get, Param, Post, Put, Body, Req, UseGuards, ParseIntPipe, Query, Res } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CvService } from "./cv.service";
import { PdfService } from "./pdf.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { Response } from "express";
import { CreateCvDto, UpdateCvDto, CreateFullCvDto } from "./dto/cv.dto";
import { GenerateCvDto } from "./dto/generate-cv.dto";
import { PageOptionsDto, PaginateDto } from "../../dtos/paginate.dto";
import { Cv } from "./entity/cv.entity";

@ApiTags('cvs')
@Controller('cvs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvController {

    constructor(
        private readonly cvService: CvService,
        private readonly pdfService: PdfService,
    ) { }

    @ApiOperation({ summary: 'Obtener todos los CVs del usuario actual (paginado)' })
    @ApiOkResponse({ type: PaginateDto })
    @ApiQuery({ type: PageOptionsDto })
    @Get()
    index(@Req() req: Request, @Query() pageOptions: PageOptionsDto) {
        const user = req.user as { id: number };
        return this.cvService.getAll(user.id, pageOptions);
    }

    @ApiOperation({ summary: 'Obtener un CV por ID' })
    @ApiOkResponse({ type: String })
    @Get(':id')
    show(@Param('id', ParseIntPipe) id: number) {
        return this.cvService.getById(id);
    }

    @ApiOperation({ summary: 'Crear un nuevo CV' })
    @ApiCreatedResponse({ type: String })
    @Post()
    store(@Req() req: Request, @Body() data: CreateFullCvDto) {
        const user = req.user as { id: number };
        return this.cvService.createFullCv(data, user.id);
    }

    @ApiOperation({ summary: 'Actualizar un CV' })
    @ApiOkResponse({ type: String })
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCvDto) {
        return this.cvService.update(id, data);
    }

    @ApiOperation({ summary: 'Eliminar un CV' })
    @ApiOkResponse({ type: String })
    @Delete(':id')
    destroy(@Param('id', ParseIntPipe) id: number) {
        return this.cvService.delete(id);
    }

    @ApiOperation({ summary: 'Generar CV optimizado con IA DeepSeek' })
    @ApiCreatedResponse({ type: String })
    @Post('generate')
    generateWithAi(@Req() req: Request, @Body() data: GenerateCvDto) {
        const user = req.user as { id: number };
        return this.cvService.generateCvWithAi(data, user.id);
    }

    @ApiOperation({ summary: 'Exportar CV a PDF formato Harvard' })
    @ApiOkResponse({ type: String })
    @Get(':id/pdf')
    async exportPdf(
        @Param('id', ParseIntPipe) id: number,
        @Query('versionId') versionId: string,
        @Res() res: Response
    ) {
        const versionIdNum = versionId ? parseInt(versionId, 10) : undefined;
        const pdfBuffer = await this.pdfService.generateHarvardPdf(id, versionIdNum);
        
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="cv-${id}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });
        
        res.end(pdfBuffer);
    }
}
