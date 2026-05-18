import { LeadEntity, LeadProperties } from "../entities";

export abstract class ILeadRepository { // Interface que define los métodos que debe implementar un repositorio de leads
    abstract create(data: LeadProperties): Promise<string>;
    abstract findAll(): Promise<LeadEntity[]>;
    abstract findById(id: string): Promise<LeadEntity>;
    abstract update(id: string, data: Partial<LeadEntity>): Promise<string>;
    abstract delete(id: string): Promise<string>;
}