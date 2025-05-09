import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ReceivableDebtTypeEnum } from '../enums/receivable-debt-type-enum';
import { ReceivableDebtStatusEnum } from '../enums/receivable-debt-status';
import { Transform } from 'class-transformer';

export class CreateReceivableDebtDto {
  @IsEnum(ReceivableDebtTypeEnum, {
    message: 'type must be receivable or debt',
  })
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  type: ReceivableDebtTypeEnum;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'person is required' })
  person: string;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsNotEmpty({ message: 'date is required' })
  date: string;

  @IsOptional()
  @IsString()
  description: string;
}
