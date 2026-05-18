import { Injectable } from "@nestjs/common";
import { StatsEntity } from "../../domain/entities";
import { ILeadRepository } from "../../domain/repositories";

@Injectable()
export class GetStatsUseCase {
    constructor(
        private readonly leadRepository: ILeadRepository
    ) { }

    async execute(): Promise<StatsEntity> {
        try {
            return await this.leadRepository.stats();
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener las estadísticas');
        }
    }
}