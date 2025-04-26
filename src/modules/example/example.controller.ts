import { Controller, Get, Query, UsePipes, BadRequestException, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ExampleService } from "./example.service";
import { HelloResponseDto } from "./hello.schema";
import { ReportRequestDto, ReportRequestSchema, ReportResponseDto } from "./report.schema";


@ApiTags('example')
@Controller('example')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService){}

    @Get('test-1')
    @ApiOperation({ summary: 'Obtener saludo con fecha' })
    @ApiResponse({ status: 200, description: 'Retorna un saludo' })
    getHello(@Query('date_start') dateStart: string): string {
        return this.exampleService.getHello(dateStart);
    }

    @Get('test-2')
    @ApiOperation({ summary: 'Obtener saludo en formato JSON' })
    @ApiResponse({ 
        status: 200, 
        type: HelloResponseDto // Mucho más simple que definir el schema manualmente
    })
    getHello2(): HelloResponseDto {
        return {
            hello: 'world'
        };
    }
    
    @Get('reports')
    @ApiOperation({ summary: 'Procesar fecha con validación Zod' })
    @ApiResponse({ 
        status: 200, 
        type: ReportResponseDto,
        description: 'Retorna la fecha procesada'
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Error processing the request'
    })
    report( @Param() reportRequestDto: ReportRequestDto ) : ReportResponseDto
    {
        try {
            // La fecha ya está validada gracias al pipe
            return this.exampleService.processDate(reportRequestDto.date_start, reportRequestDto.date_end);
        } catch (error) {
            throw new BadRequestException('Error al procesar la fecha: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }
    
    @Get('objeto-validado')
    @ApiOperation({ summary: 'Validar objeto completo con Zod' })
    @ApiResponse({ 
        status: 200, 
        type: ReportResponseDto
    })
    getValidatedObject(@Body() reportRequestDto: ReportRequestDto) : ReportResponseDto
    {
        // Todo el objeto query ya está validado por el pipe a nivel de controlador
        return this.exampleService.processDate(reportRequestDto.date_start, reportRequestDto.date_end);
    }
}