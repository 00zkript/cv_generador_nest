import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";


@Controller('cvs')
export class CvController 
{

    @Get()
    index() {
    }
    
    @Get(':id')
    show(@Param('id') id:number)  {
        return {
            id: id,
            name: 'Cv'
        };
    }
    
    @Post()
    store(@Body() data: object) {
    }
    
    @Put(':id')
    update(@Param('id') id : number, data) {
    }
    
    @Delete(':id')
    destroy(@Param('id') id : number) {
    }
    
    @Post(':id/duplicate')
    duplicate(@Param('id') id : number) {
    }
    
    @Get(':id/pdf')
    pdf(@Param('id') id : number) {}


}