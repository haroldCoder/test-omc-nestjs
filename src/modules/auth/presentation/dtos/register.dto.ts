import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Administrador OMC',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'admin@omc.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña de acceso seguro',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
