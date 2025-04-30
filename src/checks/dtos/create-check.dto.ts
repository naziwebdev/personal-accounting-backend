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

  @IsDateString()
  @IsNotEmpty({ message: 'issued is required' })
  issued: string;

  @IsDateString()
  @IsNotEmpty({ message: 'due-date is required' })
  due_date: string;

  @IsOptional()
  @IsString()
  serial: string;

  @IsOptional()
  @IsString()
  description: string;
}
