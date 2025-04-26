import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EducationService } from './education.service';
import { Education } from './education.entity';

@Controller('education')
export class EducationController {
    constructor(private readonly educationService: EducationService) {}

    @Post()
    create(@Body() education: Education) {
        return this.educationService.create(education);
    }

    @Get()
    findAll() {
        return this.educationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.educationService.findOne(+id);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.educationService.findByUser(+userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() education: Education) {
        return this.educationService.update(+id, education);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.educationService.remove(+id);
    }
}