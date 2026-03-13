import { Controller, Delete, Get, Param, Post, Put, Body, Req, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CvService } from "./cv.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@ApiTags('cvs')
@Controller('cvs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvController {

    constructor(
        private readonly cvService: CvService
    ) { }

    @ApiOperation({ summary: 'Obtener todos los CVs del usuario actual' })
    @ApiOkResponse({ type: [String] })
    @Get()
    index(@Req() req: Request) {
        const user = req.user as { id: number };
        return this.cvService.getAll(user.id);
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
    store(@Req() req: Request, @Body() data: any) {
        const user = req.user as { id: number };
        return this.cvService.create(data, user.id);
    }

    @ApiOperation({ summary: 'Actualizar un CV' })
    @ApiOkResponse({ type: String })
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.cvService.update(id, data);
    }

    @ApiOperation({ summary: 'Eliminar un CV' })
    @ApiOkResponse({ type: String })
    @Delete(':id')
    destroy(@Param('id', ParseIntPipe) id: number) {
        return this.cvService.delete(id);
    }
}
