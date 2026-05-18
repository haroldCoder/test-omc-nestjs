import { Test, TestingModule } from '@nestjs/testing';
import { CreateLeadUseCase } from './create-lead.use-case';
import { FindAllLeadsUseCase } from './find-all-leads.use-case';
import { FindLeadUseCase } from './find-lead.use-case';
import { UpdateLeadUseCase } from './update-lead.use-case';
import { DeleteLeadUseCase } from './delete-lead.use-case';
import { GetSummaryUseCase } from './get-summary.use-case';
import { ILeadRepository } from '../../domain/repositories';
import { LeadEntity } from '../../domain/entities';
import { FountainEnum } from '../../domain/enums';
import { LeadNotFoundException } from '../../domain/exception';

describe('Leads Use Cases', () => {
    let createLeadUseCase: CreateLeadUseCase;
    let findAllLeadsUseCase: FindAllLeadsUseCase;
    let findLeadUseCase: FindLeadUseCase;
    let updateLeadUseCase: UpdateLeadUseCase;
    let deleteLeadUseCase: DeleteLeadUseCase;
    let getSummaryUseCase: GetSummaryUseCase;
    let mockLeadRepository: jest.Mocked<ILeadRepository>;

    beforeEach(async () => {
        const repositoryMock = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            stats: jest.fn(),
            summary: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateLeadUseCase,
                FindAllLeadsUseCase,
                FindLeadUseCase,
                UpdateLeadUseCase,
                DeleteLeadUseCase,
                GetSummaryUseCase,
                {
                    provide: ILeadRepository,
                    useValue: repositoryMock,
                },
            ],
        }).compile();

        createLeadUseCase = module.get<CreateLeadUseCase>(CreateLeadUseCase);
        findAllLeadsUseCase = module.get<FindAllLeadsUseCase>(FindAllLeadsUseCase);
        findLeadUseCase = module.get<FindLeadUseCase>(FindLeadUseCase);
        updateLeadUseCase = module.get<UpdateLeadUseCase>(UpdateLeadUseCase);
        deleteLeadUseCase = module.get<DeleteLeadUseCase>(DeleteLeadUseCase);
        getSummaryUseCase = module.get<GetSummaryUseCase>(GetSummaryUseCase);
        mockLeadRepository = module.get(ILeadRepository);
    });

    describe('CreateLeadUseCase', () => {
        it('debe crear un lead válido exitosamente y retornar su ID', async () => {
            const data = {
                name: 'Juan Perez',
                email: 'juan.perez@example.com',
                phone: '+573001234567',
                fountain: FountainEnum.INSTAGRAM,
                interest_product: 'Curso NestJS',
                budget: 200,
            };
            mockLeadRepository.create.mockResolvedValue('lead-id-123');

            const id = await createLeadUseCase.execute(data);

            expect(id).toBe('lead-id-123');
            expect(mockLeadRepository.create).toHaveBeenCalled();
        });

        it('debe lanzar un error si el email del lead es inválido', async () => {
            const invalidData = {
                name: 'Juan Perez',
                email: 'email-invalido',
                phone: '+573001234567',
                fountain: FountainEnum.INSTAGRAM,
            };

            await expect(createLeadUseCase.execute(invalidData)).rejects.toThrow(
                'datos invalidos para la creacion del lead',
            );
            expect(mockLeadRepository.create).not.toHaveBeenCalled();
        });

        it('debe lanzar un error si el nombre del lead es inválido (muy corto)', async () => {
            const invalidData = {
                name: 'J',
                email: 'juan.perez@example.com',
                fountain: FountainEnum.INSTAGRAM,
            };

            await expect(createLeadUseCase.execute(invalidData)).rejects.toThrow(
                'datos invalidos para la creacion del lead',
            );
            expect(mockLeadRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('FindAllLeadsUseCase', () => {
        it('debe retornar todos los leads registrados', async () => {
            const mockLeads: LeadEntity[] = [];
            mockLeadRepository.findAll.mockResolvedValue(mockLeads);

            const result = await findAllLeadsUseCase.execute();

            expect(result).toEqual(mockLeads);
            expect(mockLeadRepository.findAll).toHaveBeenCalled();
        });

        it('debe lanzar una excepción genérica si falla el repositorio', async () => {
            mockLeadRepository.findAll.mockRejectedValue(new Error('DB Error'));

            await expect(findAllLeadsUseCase.execute()).rejects.toThrow(
                'Error al buscar los leads',
            );
        });
    });

    describe('FindLeadUseCase', () => {
        it('debe retornar el lead correspondiente al ID buscado', async () => {
            const mockLead = new LeadEntity();
            mockLead.create({
                name: 'Juan Perez',
                email: 'juan.perez@example.com',
                fountain: FountainEnum.INSTAGRAM,
            });
            mockLeadRepository.findById.mockResolvedValue(mockLead);

            const result = await findLeadUseCase.execute('some-id');

            expect(result).toEqual(mockLead);
            expect(mockLeadRepository.findById).toHaveBeenCalledWith('some-id');
        });

        it('debe lanzar LeadNotFoundException si el lead no existe', async () => {
            mockLeadRepository.findById.mockRejectedValue(new LeadNotFoundException());

            await expect(findLeadUseCase.execute('non-existent-id')).rejects.toThrow(
                LeadNotFoundException,
            );
        });

        it('debe lanzar un error genérico si ocurre otra falla en la base de datos', async () => {
            mockLeadRepository.findById.mockRejectedValue(new Error('Conectividad fallida'));

            await expect(findLeadUseCase.execute('some-id')).rejects.toThrow(
                'Error al buscar el lead',
            );
        });
    });

    describe('UpdateLeadUseCase', () => {
        it('debe actualizar los datos válidos y retornar el ID', async () => {
            mockLeadRepository.update.mockResolvedValue('lead-id-123');

            // Enviamos un objeto completo que sea válido por sí mismo para satisfacer isValid()
            const id = await updateLeadUseCase.execute('lead-id-123', {
                name: 'Nombre Actualizado',
                email: 'actualizado@example.com',
                fountain: FountainEnum.FACEBOOK,
            });

            expect(id).toBe('lead-id-123');
            expect(mockLeadRepository.update).toHaveBeenCalled();
        });

        it('debe lanzar un error si los datos de actualización no son válidos (ej. email inválido o incompleto)', async () => {
            // Un email incorrecto o datos incompletos harán fallar a isValid()
            await expect(
                updateLeadUseCase.execute('lead-id-123', {
                    email: 'correo-erroneo',
                }),
            ).rejects.toThrow('Error al actualizar el lead');
            expect(mockLeadRepository.update).not.toHaveBeenCalled();
        });

        it('debe propagar LeadNotFoundException si el lead no existe', async () => {
            mockLeadRepository.update.mockRejectedValue(new LeadNotFoundException());

            // Los datos deben ser válidos de por sí para pasar a la capa del repositorio
            await expect(
                updateLeadUseCase.execute('non-existent-id', {
                    name: 'Nombre Valido',
                    email: 'valido@example.com',
                    fountain: FountainEnum.FACEBOOK
                }),
            ).rejects.toThrow(LeadNotFoundException);
        });
    });

    describe('DeleteLeadUseCase', () => {
        it('debe eliminar el lead y retornar el ID del lead eliminado', async () => {
            mockLeadRepository.delete.mockResolvedValue('lead-id-123');

            const id = await deleteLeadUseCase.execute('lead-id-123');

            expect(id).toBe('lead-id-123');
            expect(mockLeadRepository.delete).toHaveBeenCalledWith('lead-id-123');
        });

        it('debe propagar LeadNotFoundException si el lead a eliminar no existe', async () => {
            mockLeadRepository.delete.mockRejectedValue(new LeadNotFoundException());

            await expect(deleteLeadUseCase.execute('non-existent-id')).rejects.toThrow(
                LeadNotFoundException,
            );
        });

        it('debe lanzar un error genérico si ocurre otra falla al eliminar', async () => {
            mockLeadRepository.delete.mockRejectedValue(new Error('Delete error'));

            await expect(deleteLeadUseCase.execute('some-id')).rejects.toThrow(
                'Error al eliminar el lead',
            );
        });
    });

    describe('GetSummaryUseCase', () => {
        it('debe retornar el resumen del repositorio exitosamente', async () => {
            mockLeadRepository.summary.mockResolvedValue('Resumen ejecutivo de IA');

            const result = await getSummaryUseCase.execute();

            expect(result).toBe('Resumen ejecutivo de IA');
            expect(mockLeadRepository.summary).toHaveBeenCalled();
        });

        it('debe lanzar un error genérico si el repositorio falla al generar el resumen', async () => {
            mockLeadRepository.summary.mockRejectedValue(new Error('Summary error'));

            await expect(getSummaryUseCase.execute()).rejects.toThrow(
                'Error al generar el resumen de leads',
            );
        });
    });
});
