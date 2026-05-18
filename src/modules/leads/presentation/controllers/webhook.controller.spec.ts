import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { CreateLeadUseCase } from '../../application/use-cases';
import { BadRequestException } from '@nestjs/common';
import { FountainEnum } from '../../domain/enums';

describe('WebhookController', () => {
    let controller: WebhookController;
    let mockCreateLeadUseCase: any;

    beforeEach(async () => {
        mockCreateLeadUseCase = {
            execute: jest.fn().mockResolvedValue('6a0b65b18a1f10562c9df8a3'),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [WebhookController],
            providers: [
                {
                    provide: CreateLeadUseCase,
                    useValue: mockCreateLeadUseCase,
                },
            ],
        }).compile();

        controller = module.get<WebhookController>(WebhookController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('handleTypeformWebhook', () => {
        it('should successfully parse a valid Typeform payload and create a lead', async () => {
            const mockPayload = {
                form_response: {
                    form_id: 'L9Xw2b',
                    answers: [
                        {
                            type: 'text',
                            text: 'Juan Pérez',
                            field: { id: 'name_field', ref: 'name' },
                        },
                        {
                            type: 'email',
                            email: 'juan.perez@example.com',
                            field: { id: 'email_field', ref: 'email' },
                        },
                        {
                            type: 'phone_number',
                            phone_number: '+573001234567',
                            field: { id: 'phone_field', ref: 'phone' },
                        },
                        {
                            type: 'choice',
                            choice: { label: 'Curso Avanzado de NestJS' },
                            field: { id: 'product_field', ref: 'product' },
                        },
                        {
                            type: 'number',
                            number: 300,
                            field: { id: 'budget_field', ref: 'budget' },
                        },
                    ],
                },
            };

            const result = await controller.handleTypeformWebhook(mockPayload);

            expect(result).toEqual({
                message: 'Webhook de Typeform procesado y Lead creado exitosamente.',
                leadId: '6a0b65b18a1f10562c9df8a3',
            });

            expect(mockCreateLeadUseCase.execute).toHaveBeenCalledWith({
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '+573001234567',
                fountain: FountainEnum.LANDING_PAGE,
                interest_product: 'Curso Avanzado de NestJS',
                budget: 300,
            });
        });

        it('should throw BadRequestException if form_response is missing', async () => {
            await expect(controller.handleTypeformWebhook({})).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if answers are missing', async () => {
            const mockPayload = {
                form_response: {},
            };
            await expect(controller.handleTypeformWebhook(mockPayload)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if name is missing', async () => {
            const mockPayload = {
                form_response: {
                    answers: [
                        {
                            type: 'email',
                            email: 'juan.perez@example.com',
                            field: { id: 'email_field', ref: 'email' },
                        },
                    ],
                },
            };
            await expect(controller.handleTypeformWebhook(mockPayload)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if email is missing', async () => {
            const mockPayload = {
                form_response: {
                    answers: [
                        {
                            type: 'text',
                            text: 'Juan Pérez',
                            field: { id: 'name_field', ref: 'name' },
                        },
                    ],
                },
            };
            await expect(controller.handleTypeformWebhook(mockPayload)).rejects.toThrow(BadRequestException);
        });
    });
});
