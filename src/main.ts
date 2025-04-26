import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  patchNestjsSwagger();

  const config = new DocumentBuilder()
    .setTitle('API Generador de CV')
    .setDescription('API para gestionar datos de currículum vitae')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  // SwaggerModule.setup('swagger', app, documentFactory, {
  //   jsonDocumentUrl: 'swagger/json',
  // });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
