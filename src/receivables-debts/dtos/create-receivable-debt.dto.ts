import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ReceivableDebtTypeEnum } from '../enums/receivable-debt-type-enum';
import { Transform } from 'class-transformer';

export class CreateReceivableDebtDto {
  @ApiProperty({ example: 'receivable', description: 'Type of transaction (receivable or debt)', enum: ReceivableDebtTypeEnum })
  @IsEnum(ReceivableDebtTypeEnum, { message: 'type must be receivable or debt' })
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  type: ReceivableDebtTypeEnum;

  @ApiProperty({ example: 500000, description: 'Amount of receivable or debt' })
  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @ApiProperty({ example: 'John Doe', description: 'Person involved in the transaction' })
  @IsString()
  @IsNotEmpty({ message: 'person is required' })
  person: string;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z', description: 'Transaction date (ISO format)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsNotEmpty({ message: 'date is required' })
  date: string;

  @ApiProperty({ example: 'Payment for services', description: 'Additional description' })
  @IsOptional()
  @IsString()
  description?: string;
}
