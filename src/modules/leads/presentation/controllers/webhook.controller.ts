import { Body, Controller, Post, BadRequestException, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLeadUseCase } from '../../application/use-cases';
import { CreateLeadDto } from '../dtos';
import { FountainEnum } from '../../domain/enums';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Webhooks')
@Controller('leads')
export class WebhookController {
  constructor(private readonly createLeadUseCase: CreateLeadUseCase) { }

  @Post('webhook')
  @SkipThrottle() // Exime a los Webhooks de ráfagas masivas del rate limiting estándar
  @ApiOperation({
    summary: 'Recibir Webhook de Typeform',
    description: 'Procesa y parsea automáticamente una respuesta de formulario de Typeform para registrarla como un lead en la base de datos.',
  })
  @ApiResponse({ status: 201, description: 'Webhook recibido y lead creado de forma exitosa.' })
  @ApiResponse({ status: 400, description: 'Estructura de Webhook inválida o datos de entrada incorrectos.' })
  async handleTypeformWebhook(@Body() payload: any): Promise<{
    message: string;
    leadId: string;
  }> {
    try {
      const formResponse = payload?.form_response;
      if (!formResponse || !Array.isArray(formResponse.answers)) {
        throw new BadRequestException('Estructura de webhook inválida: form_response o answers faltantes.');
      }

      let name = '';
      let email = '';
      let phone = '';
      let interest_product = '';
      let budget = 0;

      // Iterar sobre las respuestas para mapearlas a propiedades de lead
      for (const answer of formResponse.answers) {
        const ref = answer.field?.ref || '';
        const id = answer.field?.id || '';

        if (ref === 'name' || id.includes('name')) {
          name = answer.text || '';
        } else if (ref === 'email' || id.includes('email')) {
          email = answer.email || '';
        } else if (ref === 'phone' || id.includes('phone')) {
          phone = answer.phone_number || answer.text || '';
        } else if (ref === 'product' || id.includes('product') || id.includes('interest')) {
          interest_product = answer.choice?.label || answer.text || '';
        } else if (ref === 'budget' || id.includes('budget')) {
          budget = Number(answer.number || 0);
        }
      }

      if (!name || !email) {
        throw new BadRequestException('El Webhook de Typeform no contiene los datos mínimos requeridos (nombre y email).');
      }

      // Mapear el lead con la fuente origen (Typeform -> landing_page)
      const leadDto: CreateLeadDto = {
        name,
        email,
        phone: phone || undefined,
        fountain: FountainEnum.LANDING_PAGE,
        interest_product: interest_product || undefined,
        budget: budget || undefined,
      };

      const leadId = await this.createLeadUseCase.execute(leadDto);

      return {
        message: 'Webhook de Typeform procesado y Lead creado exitosamente.',
        leadId,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(`Error al procesar el webhook: ${error.message}`);
    }
  }
}
