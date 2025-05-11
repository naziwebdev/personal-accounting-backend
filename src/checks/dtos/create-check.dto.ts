import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'pay',
    description: 'Check type (pay or receive)',
    enum: CheckTypeEnum,
  })
  @IsEnum(CheckTypeEnum, { message: 'type must be pay or receive' })
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  type: CheckTypeEnum;

  @ApiProperty({
    example: 'pending',
    description: 'Check status (pending/paid/returned)',
    enum: CheckStatusEnum,
  })
  @IsEnum(CheckStatusEnum, { message: 'status must be pending/paid/returned' })
  @IsNotEmpty({ message: 'status is required' })
  @IsString()
  status: CheckStatusEnum;

  @ApiProperty({ example: 500000, description: 'Check price' })
  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @ApiProperty({ example: 'Saman', description: 'Bank name' })
  @IsString({ message: 'bank must be string' })
  @IsNotEmpty({ message: 'bank is required' })
  bank: string;

  @ApiProperty({ example: 'John Doe', description: 'Payable person or entity' })
  @IsString({ message: 'payable must be string' })
  @IsNotEmpty({ message: 'payable is required' })
  payable: string;

  @ApiProperty({
    example: '2024-05-01T00:00:00.000Z',
    description: 'Issued date (ISO format)',
  })
  @IsNotEmpty({ message: 'issued is required' })
  @Transform(({ value }) => new Date(value).toISOString()) // Convert to ISO format
  @IsDateString()
  issued: string;

  @ApiProperty({
    example: '2024-06-01T00:00:00.000Z',
    description: 'Due date (ISO format)',
  })
  @IsNotEmpty({ message: 'due-date is required' })
  @Transform(({ value }) => new Date(value).toISOString()) // Convert to ISO format
  @IsDateString()
  due_date: string;

  @ApiPropertyOptional({
    example: 'ABC123',
    description: 'Check serial number',
  })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiPropertyOptional({
    example: 'Payment for services',
    description: 'Check description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
