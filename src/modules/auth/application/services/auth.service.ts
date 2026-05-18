import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../../infrastructure/schemas/user.schema';
import { RegisterDto, LoginDto } from '../../presentation/dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserDocument.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Registra un nuevo usuario aplicando hash seguro a la contraseña.
   */
  async register(registerDto: RegisterDto): Promise<{ message: string; userId: string }> {
    const { name, email, password } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    // Hashear la contraseña con 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      message: 'Usuario registrado exitosamente.',
      userId: (newUser._id as any).toString(),
    };
  }

  /**
   * Valida credenciales de acceso y genera un JSON Web Token (JWT).
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Comparar hashes de contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Generar y firmar JWT
    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
