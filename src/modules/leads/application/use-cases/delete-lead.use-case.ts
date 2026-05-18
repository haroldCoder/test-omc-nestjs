import { LeadNotFoundException } from "../../domain/exception";
import { ILeadRepository } from "../../domain/repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteLeadUseCase {
    constructor(private readonly leadRepository: ILeadRepository) { }

    async execute(id: string): Promise<string> {
        try {
            const idDelete = await this.leadRepository.delete(id);
            return idDelete;
        }
        catch (error) {
            if (error instanceof LeadNotFoundException) {
                throw error;
            }
            throw new Error('Error al eliminar el lead');
        }
    }
}