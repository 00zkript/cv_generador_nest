import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { Reference } from './reference.entity';

@Controller('references')
export class ReferencesController {
    constructor(private readonly referencesService: ReferencesService) {}

    @Post()
    async create(@Body() reference: Partial<Reference>): Promise<Reference> {
        return await this.referencesService.create(reference);
    }

    @Get('user/:userId')
    async findAll(@Param('userId') userId: number): Promise<Reference[]> {
        return await this.referencesService.findAll(userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Reference> {
        return await this.referencesService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() reference: Partial<Reference>
    ): Promise<Reference> {
        return await this.referencesService.update(id, reference);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.referencesService.delete(id);
    }
}