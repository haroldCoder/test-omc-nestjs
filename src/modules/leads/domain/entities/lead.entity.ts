import { FountainEnum } from "../enums";

export class LeadEntity { // Entidad de dominio para representar un Lead
    id: string;
    name: string;
    email: string;
    phone?: string;
    fountain: FountainEnum; // este podria ser llamado source, simplemente, es para ver el poder de los mappers
    interest_product?: string;
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