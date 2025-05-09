import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { CheckTypeEnum } from '../enums/check-type-enum';
import { CheckStatusEnum } from '../enums/check-status-enum';
import { Transform } from 'class-transformer';

export class CreateCheckDto {
  @IsEnum(CheckTypeEnum, { message: 'type must be pay or receive' })
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  type: CheckTypeEnum;

  @IsEnum(CheckStatusEnum, {
    message: 'status must be pendding /paid/returned',
  })
  @IsNotEmpty({ message: 'status is required' })
  @IsString()
  status: CheckStatusEnum;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsString({ message: 'bank must be string' })
  @IsNotEmpty({ message: 'bank is required' })
  bank: string;

  @IsString({ message: 'payable must be string' })
  @IsNotEmpty({ message: 'payable is required' })
  payable: string;

  @IsNotEmpty({ message: 'issued is required' })
  @Transform(({ value }) => new Date(value).toISOString()) // ✅ Convert to ISO format
  @IsDateString()
  issued: string;

  @IsNotEmpty({ message: 'due-date is required' })
  @Transform(({ value }) => new Date(value).toISOString()) // ✅ Convert to ISO format
  @IsDateString()
  due_date: string;

  @IsOptional()
  @IsString()
  serial: string;

  @IsOptional()
  @IsString()
  description: string;
}
