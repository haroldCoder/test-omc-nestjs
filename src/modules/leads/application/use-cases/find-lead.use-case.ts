import { Injectable } from "@nestjs/common";
import { ILeadRepository } from "../../domain/repositories";
import { LeadEntity } from "../../domain/entities";
import { LeadNotFoundException } from "../../domain/exception";

@Injectable()
export class FindLeadUseCase {
    constructor(private readonly leadRepository: ILeadRepository) { }

    async execute(id: string): Promise<LeadEntity> {
        try {
            const lead = await this.leadRepository.findById(id);
            return lead;
        }
        catch (error) {
            if (error instanceof LeadNotFoundException) {
                throw error;
            }
            throw new Error('Error al buscar el lead');
        }
    }
}