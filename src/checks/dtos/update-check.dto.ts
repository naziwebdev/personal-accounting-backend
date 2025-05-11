import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { CheckTypeEnum } from '../enums/check-type-enum';
import { Transform } from 'class-transformer';

export class UpdateCheckDto {
  @ApiPropertyOptional({ example: 'pay', description: 'Check type (pay or receive)', enum: CheckTypeEnum })
  @IsEnum(CheckTypeEnum, { message: 'type must be pay or receive' })
  @IsOptional()
  @IsString()
  type?: CheckTypeEnum;

  @ApiPropertyOptional({ example: 500000, description: 'Check price' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'Saman', description: 'Bank name' })
  @IsString({ message: 'bank must be string' })
  @IsOptional()
  bank?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Payable person or entity' })
  @IsString({ message: 'payable must be string' })
  @IsOptional()
  payable?: string;

  @ApiPropertyOptional({ example: '2024-05-01T00:00:00.000Z', description: 'Issued date (ISO format)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  issued?: string;

  @ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z', description: 'Due date (ISO format)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({ example: 'ABC123', description: 'Check serial number' })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiPropertyOptional({ example: 'Payment for services', description: 'Check description' })
  @IsOptional()
  @IsString()
  description?: string;
}
