import { LeadEntity } from "../../domain/entities";
import { ILeadRepository } from "../../domain/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindAllLeadsUseCase {
    constructor(private readonly leadRepository: ILeadRepository) { }

    async execute(): Promise<LeadEntity[]> {
        try {
            const leads = await this.leadRepository.findAll();
            return leads;
        }
        catch (error) {
            throw new Error('Error al buscar los leads');
        }
    }
}