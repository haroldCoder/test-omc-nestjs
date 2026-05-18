import { LeadEntity } from '../../domain/entities';
import { LeadDocument } from '../schemas';
import { FountainEnum } from '../../domain/enums';

export class LeadMapper {
    static toDomain(document: LeadDocument): LeadEntity {
        const entity = new LeadEntity();
        entity.id = document._id.toString();
        entity.name = document.name;
        entity.email = document.email;
        entity.phone = document.phone;
        entity.fountain = document.source as FountainEnum; // Mapea 'source' (base de datos) a 'fountain' (entidad de dominio)
        entity.interest_product = document.productInterest; // Mapea 'productInterest' (base de datos) a 'interest_product' (entidad de dominio)
        entity.budget = document.budget;
        return entity;
    }

    static toPersistence(entity: LeadEntity): Partial<LeadDocument> {
        return {
            name: entity.name,
            email: entity.email,
            phone: entity.phone,
            source: entity.fountain, // Mapea 'fountain' (entidad de dominio) a 'source' (base de datos)
            productInterest: entity.interest_product, // Mapea 'interest_product' (entidad de dominio) a 'productInterest' (base de datos)
            budget: entity.budget,
        };
    }
}
