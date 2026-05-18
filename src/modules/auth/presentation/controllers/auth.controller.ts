import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto } from '../dtos';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo administrador',
    description: 'Registra un usuario administrador en el sistema aplicando hash seguro a su contraseña.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Payload inválido.' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe.' })
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string; userId: string }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión administrador',
    description: 'Valida las credenciales de correo y contraseña y devuelve un token firmado JWT.',
  })
  @ApiResponse({ status: 200, description: 'Autenticación exitosa. Devuelve el JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
