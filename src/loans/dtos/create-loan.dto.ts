import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { LoanPeriodEnum } from '../enums/loan-period-enum';
import { Transform } from 'class-transformer';

export class CreateLoanDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the loan giver (length between 2-50)' })
  @IsString()
  @IsNotEmpty({ message: 'giver name is required' })
  @Length(2, 50, { message: 'giver name length must be btw 2-50' })
  giverName: string;

  @ApiProperty({ example: 'Car Loan', description: 'Title of the loan (length between 2-50)' })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @Length(2, 50, { message: 'title length must be btw 2-50' })
  title: string;

  @ApiProperty({ example: 5000000, description: 'Total price of the loan' })
  @IsNumber()
  @IsNotEmpty({ message: 'total price is required' })
  totalPrice: number;

  @ApiProperty({ example: 'Loan for buying a car', description: 'Loan description (length between 3-2000)' })
  @IsString()
  @IsOptional()
  @Length(3, 2000, { message: 'description length must be btw 3-2000' })
  description?: string;

  @ApiProperty({ example: 12, description: 'Number of installments' })
  @IsInt()
  @IsNotEmpty({ message: 'count of installment is required' })
  countInstallment: number;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z', description: 'First installment date (ISO format)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsNotEmpty({ message: 'first installment date is required' })
  firstDateInstallment: string;

  @ApiProperty({ example: 'monthly', description: 'Installment period (weekly/monthly/yearly)', enum: LoanPeriodEnum })
  @IsEnum(LoanPeriodEnum, { message: 'period of installment must be weekly/monthly/yearly' })
  periodInstallment: LoanPeriodEnum;
}
