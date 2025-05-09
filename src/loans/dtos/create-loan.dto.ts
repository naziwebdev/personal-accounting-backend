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
  @IsString()
  @IsNotEmpty({ message: 'giver name is required' })
  @Length(2, 50, { message: 'giver name length must be btw 2-50' })
  giverName: string;

  @IsString()
  @IsNotEmpty({ message: 'giver name is required' })
  @Length(2, 50, { message: 'giver name length must be btw 2-50' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: 'total price is required' })
  totalPrice: number;

  @IsString()
  @IsOptional()
  @Length(3, 2000, { message: 'giver name length must be btw 2-50' })
  description: string;

  @IsInt()
  @IsNotEmpty({ message: 'count of installment is required' })
  countInstallment: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsNotEmpty({ message: 'count of installment is required' })
  firstDateInstallment: string;

  @IsEnum(LoanPeriodEnum, {
    message: 'period of installment must be weekly/monthly,yearly',
  })
  periodInstallment: LoanPeriodEnum;
}
