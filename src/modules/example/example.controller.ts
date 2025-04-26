import { Controller, Get, Query } from "@nestjs/common";
import { ExampleService } from "./example.service";

@Controller('example')
export class ExampleController 
{
    constructor(private readonly exmapleService: ExampleService){}

    @Get('1')
    getHello(@Query('date_start') dateStart : string ): string {
        return this.exmapleService.getHello(dateStart);
    }

}