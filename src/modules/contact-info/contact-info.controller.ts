import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { ContactInfo } from './contact-info.entity';

@Controller('contact-info')
export class ContactInfoController {
    constructor(private readonly contactInfoService: ContactInfoService) {}

    @Post()
    async create(@Body() contactInfo: Partial<ContactInfo>): Promise<ContactInfo> {
        return await this.contactInfoService.create(contactInfo);
    }

    @Get(':userId')
    async findByUserId(@Param('userId') userId: number): Promise<ContactInfo> {
        return await this.contactInfoService.findByUserId(userId);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() contactInfo: Partial<ContactInfo>
    ): Promise<ContactInfo> {
        return await this.contactInfoService.update(id, contactInfo);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.contactInfoService.delete(id);
    }
}