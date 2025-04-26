import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { Experience } from './experience.entity';

@Controller('experiences')
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) {}

    @Post()
    create(@Body() experience: Experience) {
        return this.experiencesService.create(experience);
    }

    @Get()
    findAll() {
        return this.experiencesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.experiencesService.findOne(+id);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.experiencesService.findByUser(+userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() experience: Experience) {
        return this.experiencesService.update(+id, experience);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.experiencesService.remove(+id);
    }
}