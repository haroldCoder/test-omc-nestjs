import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita la validación global de DTOs
  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }
  ));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Captación de Leads - OMC')
    .setDescription('Servicio RESTful para el registro, consulta y gestión de leads comerciales.')
    .setVersion('1.0')
    .addTag('Leads', 'Operaciones relacionadas con la administración de leads')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
