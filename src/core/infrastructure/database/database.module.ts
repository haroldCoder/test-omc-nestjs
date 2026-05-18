import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI'); // asignamos el valor de la variable de entorno MONGO_URI a la variable local uri
        if (!uri) {
          throw new Error('MONGO_URI no está definido en las variables de entorno (.env).');
        }

        console.log('Database connection established -> URI: ', uri);

        return {
          uri,
        };
      },
      inject: [ConfigService], // inyectamos ConfigService para que pueda ser usado en el factory
    }),
  ],
  exports: [MongooseModule], // exportamos MongooseModule para que pueda ser usado en otros módulos
})
export class DatabaseModule { }
