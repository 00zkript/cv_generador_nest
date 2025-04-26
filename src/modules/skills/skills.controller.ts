import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { Skill } from './skill.entity';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) {}

    @Post()
    create(@Body() skill: Skill) {
        return this.skillsService.create(skill);
    }

    @Get()
    findAll() {
        return this.skillsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.skillsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() skill: Skill) {
        return this.skillsService.update(+id, skill);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.skillsService.remove(+id);
    }
}