import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString, IsOptional, IsEnum, IsNumber } from "class-validator";
import { FountainEnum } from "../../domain/enums";

export class CreateLeadDto {
    @ApiProperty({
        description: 'Nombre completo del lead.',
        example: 'Juan Pérez'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Correo electrónico único del lead.',
        example: 'juan.perez@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiPropertyOptional({
        description: 'Número de teléfono de contacto.',
        example: '+573001234567'
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: 'Fuente de procedencia del lead.',
        enum: FountainEnum,
        example: FountainEnum.INSTAGRAM
    })
    @IsNotEmpty()
    @IsEnum(FountainEnum)
    fountain: FountainEnum;

    @ApiPropertyOptional({
        description: 'Nombre del producto o servicio en el que está interesado.',
        example: 'Curso Avanzado de NestJS'
    })
    @IsOptional()
    @IsString()
    interest_product?: string;

    @ApiPropertyOptional({
        description: 'Presupuesto disponible en USD.',
        example: 250
    })
    @IsOptional()
    @IsNumber()
    budget?: number;
}