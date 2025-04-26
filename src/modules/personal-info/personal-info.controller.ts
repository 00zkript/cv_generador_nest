import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfo } from './personal-info.entity';

@Controller('personal-info')
export class PersonalInfoController {
    constructor(private readonly personalInfoService: PersonalInfoService) {}

    @Post()
    async create(@Body() personalInfo: Partial<PersonalInfo>): Promise<PersonalInfo> {
        return await this.personalInfoService.create(personalInfo);
    }

    @Get(':userId')
    async findByUserId(@Param('userId') userId: number): Promise<PersonalInfo> {
        return await this.personalInfoService.findByUserId(userId);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() personalInfo: Partial<PersonalInfo>
    ): Promise<PersonalInfo> {
        return await this.personalInfoService.update(id, personalInfo);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.personalInfoService.delete(id);
    }
}