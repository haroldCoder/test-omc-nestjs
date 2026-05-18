import { Injectable } from "@nestjs/common";
import { ILeadRepository } from "../../domain/repositories";
import { LeadEntity } from "../../domain/entities";
import { LeadNotFoundException } from "../../domain/exception";

@Injectable()
export class UpdateLeadUseCase {
    constructor(private readonly leadRepository: ILeadRepository) { }

    async execute(id: string, data: Partial<LeadEntity>): Promise<string> {
        try {
            const lead = new LeadEntity();
            lead.update(data);
            const idUpdated = await this.leadRepository.update(id, lead);
            return idUpdated;
        }
        catch (error) {
            if (error instanceof LeadNotFoundException) {
                throw error;
            }
            throw new Error('Error al actualizar el lead');
        }
    }
}