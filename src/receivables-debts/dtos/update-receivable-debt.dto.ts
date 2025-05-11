import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ReceivableDebtTypeEnum } from '../enums/receivable-debt-type-enum';
import { Transform } from 'class-transformer';

export class UpdateReceivableDebtDto {
  @ApiPropertyOptional({
    example: 'receivable',
    description: 'Type of transaction (receivable or debt)',
    enum: ReceivableDebtTypeEnum,
  })
  @IsEnum(ReceivableDebtTypeEnum, {
    message: 'type must be receivable or debt',
  })
  @IsOptional()
  @IsString()
  type?: ReceivableDebtTypeEnum;

  @ApiPropertyOptional({
    example: 500000,
    description: 'Amount of receivable or debt',
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Person involved in the transaction',
  })
  @IsString()
  @IsOptional()
  person?: string;

  @ApiPropertyOptional({
    example: '2024-06-01T00:00:00.000Z',
    description: 'Transaction date (ISO format)',
  })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    example: 'Payment for services',
    description: 'Additional description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
