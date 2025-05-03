import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];
  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 3600, // 1 hora de caché para las solicitudes preflight
  };
  app.enableCors(corsOptions);

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
