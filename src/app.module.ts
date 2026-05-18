import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/infrastructure/database/database.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 60,  // Límite de 60 peticiones por minuto por IP o Token de forma global
    }]),
    DatabaseModule, // Conexión global a MongoDB
    LeadsModule, // Módulo de Leads (Mongoose Schema, Casos de Uso y Repositorios)
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
