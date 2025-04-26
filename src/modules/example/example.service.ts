import { Injectable } from "@nestjs/common";

@Injectable()
export class ExampleService 
{
    getHello(dateStart: string): string 
    {
        return "Hello World! " + dateStart;
    }

    processDate(dateStart: string, dateEnd : string) {
        return {
            message: "Fecha procesada correctamente",
            dateStart: dateStart,
            dateEnd: dateEnd
        };
    }
}