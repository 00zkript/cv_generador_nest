import { Injectable } from "@nestjs/common";

@Injectable()
export class ExampleService 
{
    getHello(dateStart :string): string 
    {
        return "Hello World!"+dateStart;
    }
}