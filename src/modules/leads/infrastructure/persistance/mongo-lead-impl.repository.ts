import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadEntity, LeadQueriesEntity } from '../../domain/entities';
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

    async findAll(queries?: LeadQueriesEntity): Promise<LeadEntity[]> {
        const filter: any = {}; // este de aqui es todo los filtros de el schema lead

        // filtro por fuente
        if (queries?.fountain) {
            filter.source = queries.fountain; // 'source' en la base de datos
        }

        // filtro de fechas (soporta fecha única o rango separado por coma YYYY-MM-DD,YYYY-MM-DD)
        if (queries?.range_date) {
            const dates = queries.range_date.split(',');
            if (dates.length === 2 && dates[0] && dates[1]) {
                const startDate = new Date(dates[0].trim());
                const endDate = new Date(dates[1].trim());

                // Si es formato YYYY-MM-DD (longitud 10), extendemos la fecha fin hasta el final del día en UTC
                if (dates[1].trim().length === 10) {
                    endDate.setUTCHours(23, 59, 59, 999);
                }

                filter.created_at = {
                    $gte: startDate,
                    $lte: endDate,
                };
            } else if (dates[0]) {
                filter.created_at = {
                    $gte: new Date(dates[0].trim()),
                };
            }
        }

        // orden
        const sortBy = (queries?.order_date === 'ASC' ? 1 : -1) as 1 | -1;

        const page = Math.max(1, Number(queries?.page ?? 1));
        const limit = Math.max(1, Number(queries?.limit ?? 10));

        const pipeline = [
            { $match: filter },
            { $sort: { created_at: sortBy, _id: sortBy } }, // Ordenación secundaria estable con _id para evitar no-determinismo
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ];

        const leads = await this.leadModel.aggregate(pipeline);
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