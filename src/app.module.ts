import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/infrastructure/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la app
    }),
    DatabaseModule, // Conexión global a MongoDB
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
