import { Injectable } from "@nestjs/common";
import { LeadQueriesEntity } from "../../domain/entities";
import { ILeadRepository } from "../../domain/repositories";

@Injectable()
export class GetSummaryUseCase {
    constructor(
        private readonly leadRepository: ILeadRepository
    ) { }

    async execute(filters?: LeadQueriesEntity): Promise<string> {
        try {
            return await this.leadRepository.summary(filters);
        } catch (error) {
            console.error(error);
            throw new Error('Error al generar el resumen de leads');
        }
    }
}
