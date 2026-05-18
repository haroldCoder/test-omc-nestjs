import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FountainEnum } from "../enums";

export class LeadEntity { // Entidad de dominio para representar un Lead
    @ApiProperty({
        description: 'ID único del lead (ObjectId generado por MongoDB).',
        example: '6a0b65b18a1f10562c9df8a3'
    })
    id: string;

    @ApiProperty({
        description: 'Nombre completo del lead.',
        example: 'Alejandro Pérez'
    })
    name: string;

    @ApiProperty({
        description: 'Correo electrónico único del lead.',
        example: 'alejandro.perez@example.com'
    })
    email: string;

    @ApiPropertyOptional({
        description: 'Número de teléfono del lead.',
        example: '+573001234567'
    })
    phone?: string;

    @ApiProperty({
        description: 'Fuente de procedencia del lead.',
        enum: FountainEnum,
        example: FountainEnum.INSTAGRAM
    })
    fountain: FountainEnum; // este podria ser llamado source, simplemente, es para ver el poder de los mappers

    @ApiPropertyOptional({
        description: 'Nombre del producto o servicio de interés.',
        example: 'Curso Avanzado de NestJS'
    })
    interest_product?: string;

    @ApiPropertyOptional({
        description: 'Presupuesto disponible en USD.',
        example: 250
    })
    budget?: number;

    isEmailValid(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    isNameValid(): boolean {
        return this.name.length > 1;
    }

    isFountainValid(): boolean {
        return Object.values(FountainEnum).includes(this.fountain);
    }

    isValid(): boolean {
        return this.isEmailValid() && this.isNameValid() && this.isFountainValid();
    }

    update(data: Partial<LeadEntity>) { // Método para actualizar un Lead
        this.name = data.name ?? this.name;
        this.email = data.email ?? this.email;
        this.phone = data.phone ?? this.phone;
        this.fountain = data.fountain ?? this.fountain;
        this.interest_product = data.interest_product ?? this.interest_product;
        this.budget = data.budget ?? this.budget;

        if (!this.isValid()) {
            throw new Error('datos invalidos del lead para actualizar');
        }
    }

    create(data: LeadProperties) { // Método para crear un Lead, con las reglas de negocio necesarias para validar la información antes de ser creada
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.fountain = data.fountain;
        this.interest_product = data.interest_product;
        this.budget = data.budget;

        if (!this.isValid()) {
            throw new Error('datos invalidos para la creacion del lead');
        }
    }
}

export type LeadProperties = Omit<LeadEntity, 'id' | 'create' | 'update' | 'isEmailValid' | 'isNameValid' | 'isFountainValid' | 'isValid'>;