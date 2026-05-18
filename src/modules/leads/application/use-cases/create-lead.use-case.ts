import { LeadEntity } from "../../domain/entities";
import { ILeadRepository } from "../../domain/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateLeadUseCase {
    constructor(private readonly leadRepository: ILeadRepository) { }

    async execute(data: Omit<LeadEntity, 'id'>): Promise<string> {
        const lead = new LeadEntity();
        lead.create(data);
        const id = await this.leadRepository.create(lead);
        return id;
    }
}