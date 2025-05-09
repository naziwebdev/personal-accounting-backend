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
  @IsEnum(ReceivableDebtTypeEnum, {
    message: 'type must be receivable or debt',
  })
  @IsOptional()
  @IsString()
  type: ReceivableDebtTypeEnum;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  person: string;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  date: string;

  @IsOptional()
  @IsString()
  description: string;
}
