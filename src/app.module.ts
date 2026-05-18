import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/infrastructure/database/database.module';
import { LeadsModule } from './modules/leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }),
    DatabaseModule, // Conexión global a MongoDB
    LeadsModule, // Módulo de Leads (Mongoose Schema, Casos de Uso y Repositorios)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
