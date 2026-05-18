import { Body, Controller, Post, Get, Param, Put, Delete, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from "@nestjs/swagger";
import { CreateLeadUseCase, FindAllLeadsUseCase, FindLeadUseCase, UpdateLeadUseCase, DeleteLeadUseCase, GetStatsUseCase, GetSummaryUseCase } from "../../application/use-cases";
import { LeadEntity, StatsEntity } from "../../domain/entities";
import { CreateLeadDto, LeadQueriesDto, UpdateLeadDto } from "../dtos";
import { FountainEnum } from "../../domain/enums";

@ApiTags('Leads')
@Controller('api/v1/leads')
export class LeadController {
    constructor(
        private readonly createLeadUseCase: CreateLeadUseCase,
        private readonly findAllLeadsUseCase: FindAllLeadsUseCase,
        private readonly findLeadUseCase: FindLeadUseCase,
        private readonly updateLeadUseCase: UpdateLeadUseCase,
        private readonly deleteLeadUseCase: DeleteLeadUseCase,
        private readonly getStatsUseCase: GetStatsUseCase,
        private readonly getSummaryUseCase: GetSummaryUseCase
    ) { }

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo lead', description: 'Registra un lead comercial en la base de datos con validaciones estrictas de dominio.' })
    @ApiBody({ type: CreateLeadDto })
    @ApiResponse({ status: 201, description: 'Lead creado de forma exitosa. Retorna el ID único del lead.', type: String })
    @ApiResponse({ status: 400, description: 'Petición inválida por errores en la estructura del DTO o datos inválidos.' })
    async create(@Body() data: CreateLeadDto): Promise<string> {
        return this.createLeadUseCase.execute(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los leads', description: 'Obtiene una lista completa de todos los leads registrados en el sistema.' })
    @ApiResponse({ status: 200, description: 'Listado obtenido con éxito.', type: [LeadEntity] })
    @ApiResponse({ status: 500, description: 'Error interno del servidor al buscar los leads.' })
    @ApiQuery({
        name: 'page',
        type: Number,
        description: 'Número de página',
        required: false
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        description: 'Número de leads por página',
        required: false
    })
    @ApiQuery({
        name: 'fountain',
        enum: FountainEnum,
        description: 'Fuente del lead',
        required: false
    })
    @ApiQuery({
        name: 'range_date',
        description: 'Rango de fechas (formato YYYY-MM-DD,YYYY-MM-DD o YYYY-MM-DD)',
        required: false
    })
    @ApiQuery({
        name: 'order_date',
        enum: ['ASC', 'DESC'],
        description: 'Orden de la fecha',
        required: false
    })
    async findAll(@Query() queries?: LeadQueriesDto): Promise<LeadEntity[]> {
        return this.findAllLeadsUseCase.execute(queries);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Obtener estadísticas de leads', description: 'Obtiene estadísticas generales sobre los leads registrados en el sistema.' })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente.', type: StatsEntity })
    @ApiResponse({ status: 500, description: 'Error interno del servidor al obtener las estadísticas.' })
    async stats(): Promise<StatsEntity> {
        return this.getStatsUseCase.execute();
    }

    @Get('/ai/summary')
    @ApiOperation({ summary: 'Obtener resumen ejecutivo por IA', description: 'Genera un resumen analítico de los leads filtrados utilizando Inteligencia Artificial.' })
    @ApiQuery({
        name: 'fountain',
        enum: FountainEnum,
        description: 'Filtrar leads por fuente',
        required: false
    })
    @ApiQuery({
        name: 'range_date',
        description: 'Filtrar leads por rango de fechas (YYYY-MM-DD,YYYY-MM-DD o YYYY-MM-DD)',
        required: false
    })
    @ApiResponse({ status: 200, description: 'Resumen ejecutivo generado exitosamente.', type: String })
    @ApiResponse({ status: 500, description: 'Error al generar el resumen ejecutivo.' })
    async summary(@Query() queries?: LeadQueriesDto): Promise<string> {
        return this.getSummaryUseCase.execute(queries);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un lead por su ID', description: 'Busca un lead específico en la base de datos por su ID único.' })
    @ApiParam({ name: 'id', description: 'ID único del lead (representado como un ObjectId en formato hexadecimal)', example: '6a0b65b18a1f10562c9df8a3' })
    @ApiResponse({ status: 200, description: 'Lead encontrado exitosamente.', type: LeadEntity })
    @ApiResponse({ status: 404, description: 'El lead solicitado no existe.' })
    async findById(@Param('id') id: string): Promise<LeadEntity> {
        return this.findLeadUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un lead por su ID', description: 'Actualiza de forma parcial o total los atributos de un lead existente.' })
    @ApiParam({ name: 'id', description: 'ID único del lead a actualizar', example: '6a0b65b18a1f10562c9df8a3' })
    @ApiBody({ type: UpdateLeadDto })
    @ApiResponse({ status: 200, description: 'Lead actualizado exitosamente. Retorna el ID del lead actualizado.', type: String })
    @ApiResponse({ status: 400, description: 'Petición inválida por errores en la estructura de los datos del lead.' })
    @ApiResponse({ status: 404, description: 'El lead solicitado para actualizar no existe.' })
    async update(@Param('id') id: string, @Body() data: UpdateLeadDto): Promise<string> {
        return this.updateLeadUseCase.execute(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un lead por su ID', description: 'Elimina de forma permanente un lead de la base de datos.' })
    @ApiParam({ name: 'id', description: 'ID único del lead a eliminar', example: '6a0b65b18a1f10562c9df8a3' })
    @ApiResponse({ status: 200, description: 'Lead eliminado exitosamente. Retorna el ID del lead eliminado.', type: String })
    @ApiResponse({ status: 404, description: 'El lead solicitado para eliminar no existe.' })
    async delete(@Param('id') id: string): Promise<string> {
        return this.deleteLeadUseCase.execute(id);
    }

}