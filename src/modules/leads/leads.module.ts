import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadRepositoryImplementation } from './infrastructure/persistance';
import { ILeadRepository } from './domain/repositories';
import {
    CreateLeadUseCase,
    FindAllLeadsUseCase,
    FindLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    GetStatsUseCase,
    GetSummaryUseCase
} from './application/use-cases';
import { LeadDocument, LeadSchema } from './infrastructure/schemas';
import { LeadController } from './presentation/controllers';
import { LeadsAiSummaryService } from './infrastructure/persistance/services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LeadDocument.name, schema: LeadSchema },
        ]),
    ],
    controllers: [LeadController],
    providers: [
        LeadsAiSummaryService,
        // Enlazar la interfaz (ILeadRepository) a la implementación concreta (LeadRepositoryImplementation)
        {
            provide: ILeadRepository,
            useClass: LeadRepositoryImplementation,
        },
        // Casos de uso como proveedores
        CreateLeadUseCase,
        FindAllLeadsUseCase,
        FindLeadUseCase,
        UpdateLeadUseCase,
        DeleteLeadUseCase,
        GetStatsUseCase,
        GetSummaryUseCase
    ],
    exports: [
        ILeadRepository,
        CreateLeadUseCase,
        FindAllLeadsUseCase,
        FindLeadUseCase,
        UpdateLeadUseCase,
        DeleteLeadUseCase,
        GetStatsUseCase,
        GetSummaryUseCase
    ],
})
export class LeadsModule { }
