import { LeadEntity, LeadQueriesEntity } from "../../domain/entities";
import { ILeadRepository } from "../../domain/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllLeadsUseCase {
    constructor(private readonly leadRepository: ILeadRepository) { }

    async execute(queries?: LeadQueriesEntity): Promise<LeadEntity[]> {
        try {
            const leads = await this.leadRepository.findAll(queries);
            return leads;
        }
        catch (error) {
            throw new Error('Error al buscar los leads');
        }
    }
}