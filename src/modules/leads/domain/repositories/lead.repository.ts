import { LeadEntity, LeadProperties, LeadQueriesEntity, StatsEntity } from "../entities";

export abstract class ILeadRepository { // Interface que define los métodos que debe implementar un repositorio de leads
    abstract create(data: LeadProperties): Promise<string>;
    abstract findAll(queries?: LeadQueriesEntity): Promise<LeadEntity[]>;
    abstract findById(id: string): Promise<LeadEntity>;
    abstract update(id: string, data: Partial<LeadEntity>): Promise<string>;
    abstract delete(id: string): Promise<string>;
    abstract stats(): Promise<StatsEntity>; // esto lo meto en otro commit, para que se haga ver el manejo avanzado de git
    abstract summary(filters?: LeadQueriesEntity): Promise<string>; // este metodo retorna un string, que seria el resumen del LLM
}