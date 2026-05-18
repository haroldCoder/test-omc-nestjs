import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadEntity } from '../../domain/entities';
import { ILeadRepository } from '../../domain/repositories';
import { LeadNotFoundException } from '../../domain/exception';
import { LeadDocument } from '../schemas';
import { LeadMapper } from '../mappers';

@Injectable()
export class LeadRepositoryImplementation implements ILeadRepository {
    constructor(
        @InjectModel(LeadDocument.name) private readonly leadModel: Model<LeadDocument>,
    ) { }

    async create(data: LeadEntity): Promise<string> {
        const persistenceModel = LeadMapper.toPersistence(data);
        const result = await this.leadModel.create(persistenceModel);
        return result.id;
    }

    async findAll(): Promise<LeadEntity[]> {
        const leads = await this.leadModel.find();
        return leads.map(doc => LeadMapper.toDomain(doc));
    }

    async findById(id: string): Promise<LeadEntity> {
        const lead = await this.leadModel.findById(id);

        if (!lead) {
            throw new LeadNotFoundException();
        }

        return LeadMapper.toDomain(lead);
    }

    async update(id: string, data: Partial<LeadEntity>): Promise<string> {
        // Encontrar el documento existente primero
        const leadDoc = await this.leadModel.findById(id);
        if (!leadDoc) {
            throw new LeadNotFoundException();
        }

        // Convertir a entidad de dominio para aplicar las reglas de negocio de actualización
        const domainEntity = LeadMapper.toDomain(leadDoc);
        domainEntity.update(data);

        // Convertir de regreso a persistencia y guardar
        const persistenceModel = LeadMapper.toPersistence(domainEntity);
        const updatedDoc = await this.leadModel.findByIdAndUpdate(id, persistenceModel, { new: true });

        if (!updatedDoc) {
            throw new LeadNotFoundException();
        }

        return updatedDoc.id;
    }

    async delete(id: string): Promise<string> {
        const lead = await this.leadModel.findByIdAndDelete(id);

        if (!lead) {
            throw new LeadNotFoundException();
        }

        return lead.id;
    }
}