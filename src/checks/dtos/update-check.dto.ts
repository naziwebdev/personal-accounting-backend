import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { CheckTypeEnum } from '../enums/check-type-enum';

export class UpdateCheckDto {
  @IsEnum(CheckTypeEnum, { message: 'type must be pay or receive' })
  @IsOptional()
  @IsString()
  type: CheckTypeEnum;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString({ message: 'bank must be string' })
  @IsOptional()
  bank: string;

  @IsString({ message: 'payable must be string' })
  @IsOptional()
  payable: string;

  @IsDateString()
  @IsOptional()
  issued: string;

  @IsDateString()
  @IsOptional()
  due_date: string;

  @IsOptional()
  @IsString()
  serial: string;

  @IsOptional()
  @IsString()
  description: string;
}
