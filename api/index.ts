import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer: any;

async function bootstrap(): Promise<any> {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for easy API consumption from frontend applications
    app.enableCors();

    // Habilita la validación global de DTOs
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    // Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle('API de Captación de Leads - OMC')
      .setDescription('Servicio RESTful para el registro, consulta y gestión de leads comerciales.')
      .setVersion('1.0')
      .addTag('Leads', 'Operaciones relacionadas con la administración de leads')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      ],
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
    });

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};
