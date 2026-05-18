import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LeadsAiSummaryService } from './leads-ai-summary.service';
import { LeadDocument } from '../../schemas';
import { FountainEnum } from '../../../domain/enums';

describe('LeadsAiSummaryService', () => {
    let service: LeadsAiSummaryService;
    let mockLeadModel: any;

    beforeEach(async () => {
        mockLeadModel = {
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LeadsAiSummaryService,
                {
                    provide: getModelToken(LeadDocument.name),
                    useValue: mockLeadModel,
                },
            ],
        }).compile();

        service = module.get<LeadsAiSummaryService>(LeadsAiSummaryService);
    });

    it('debe estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('getSummary', () => {
        it('debe retornar mensaje de error si no hay leads', async () => {
            mockLeadModel.find.mockResolvedValue([]);

            const result = await service.getSummary();

            expect(result).toBe('No se encontraron leads con los filtros proporcionados para generar el resumen ejecutivo.');
            expect(mockLeadModel.find).toHaveBeenCalledWith({});
        });

        it('debe generar un resumen simulado por IA correcto basado en los leads retornados', async () => {
            const mockLeads = [
                {
                    name: 'Alejandro Pérez',
                    email: 'alejandro.perez@example.com',
                    phone: '+573001234567',
                    source: FountainEnum.INSTAGRAM,
                    productInterest: 'Curso Avanzado de NestJS',
                    budget: 250,
                    created_at: new Date('2026-05-18T19:17:05.396Z'),
                },
                {
                    name: 'Beatriz Gómez',
                    email: 'beatriz.gomez@example.com',
                    phone: '+5491123456789',
                    source: FountainEnum.FACEBOOK,
                    productInterest: 'Mentoría Backend Pro',
                    budget: 500,
                    created_at: new Date('2026-05-18T19:17:05.396Z'),
                },
            ];
            mockLeadModel.find.mockResolvedValue(mockLeads);

            const result = await service.getSummary();

            expect(result).toContain('RESUMEN EJECUTIVO INTELIGENTE');
            expect(result).toContain('**Volumen de Leads:** Se han identificado un total de **2 leads**');
            expect(result).toContain('**Presupuesto Promedio:** El presupuesto promedio es de **$375.00 USD**');
            expect(result).toContain('Curso Avanzado de NestJS');
            expect(mockLeadModel.find).toHaveBeenCalledWith({});
        });

        it('debe aplicar filtros correctamente al buscar leads', async () => {
            mockLeadModel.find.mockResolvedValue([]);

            await service.getSummary({
                fountain: FountainEnum.INSTAGRAM,
                range_date: '2026-05-10,2026-05-18',
            });

            expect(mockLeadModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    source: FountainEnum.INSTAGRAM,
                    created_at: expect.any(Object),
                })
            );
        });
    });
});
