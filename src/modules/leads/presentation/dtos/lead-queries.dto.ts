import { Transform, Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { FountainEnum } from '../../domain/enums';

export enum OrderDate {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class LeadQueriesDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Transform(({ value }) => Number(value))
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsEnum(FountainEnum)
    fountain?: FountainEnum;

    @IsOptional()
    @IsString()
    range_date?: string;

    @IsOptional()
    @IsEnum(OrderDate)
    order_date?: OrderDate = OrderDate.DESC;
}