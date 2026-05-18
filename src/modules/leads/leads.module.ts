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
} from './application/use-cases';
import { LeadDocument, LeadSchema } from './infrastructure/schemas';
import { LeadController } from './presentation/controllers';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LeadDocument.name, schema: LeadSchema },
        ]),
    ],
    controllers: [LeadController],
    providers: [
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
    ],
    exports: [
        ILeadRepository,
        CreateLeadUseCase,
        FindAllLeadsUseCase,
        FindLeadUseCase,
        UpdateLeadUseCase,
        DeleteLeadUseCase,
    ],
})
export class LeadsModule { }
