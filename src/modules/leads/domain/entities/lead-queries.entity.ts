import { FountainEnum } from "../enums";
import { ApiPropertyOptional } from "@nestjs/swagger";

type orderDate = 'ASC' | 'DESC';

export class LeadQueriesEntity {
    @ApiPropertyOptional({
        description: 'Número de página.',
        example: 1
    })
    page?: number;
    @ApiPropertyOptional({
        description: 'Número de registros por página.',
        example: 10
    })
    limit?: number;
    @ApiPropertyOptional({
        description: 'Fuente de procedencia del lead.',
        example: FountainEnum.INSTAGRAM
    })
    fountain?: FountainEnum;
    @ApiPropertyOptional({
        description: 'Rango de fechas para filtrar los leads.',
        example: '2022-01-01T00:00:00.000Z-2022-01-01T00:00:00.000Z'
    })
    range_date?: string;
    @ApiPropertyOptional({
        description: 'Orden de los resultados.',
        example: 'ASC'
    })
    order_date?: orderDate;
}