import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET key must be defined in environmental variables.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Valida el payload decodificado del JWT.
   * Busca al usuario en la base de datos excluyendo la contraseña del objeto de retorno.
   */
  async validate(payload: { sub: string; email: string }) {
    const user = await this.userModel.findById(payload.sub).select('-password').exec();
    if (!user) {
      throw new UnauthorizedException('Token no válido: el usuario no existe.');
    }
    return user;
  }
}
