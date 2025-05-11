import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLoanDto } from './create-loan.dto';
import { LoanPeriodEnum } from '../enums/loan-period-enum';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Name of the loan giver (length between 2-50)',
  })
  giverName?: string;

  @ApiPropertyOptional({
    example: 'Car Loan',
    description: 'Title of the loan (length between 2-50)',
  })
  title?: string;

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Total price of the loan',
  })
  totalPrice?: number;

  @ApiPropertyOptional({
    example: 'Loan for buying a car',
    description: 'Loan description (length between 3-2000)',
  })
  description?: string;

  @ApiPropertyOptional({ example: 12, description: 'Number of installments' })
  countInstallment?: number;

  @ApiPropertyOptional({
    example: '2024-06-01T00:00:00.000Z',
    description: 'First installment date (ISO format)',
  })
  firstDateInstallment?: string;

  @ApiPropertyOptional({
    example: 'monthly',
    description: 'Installment period (weekly/monthly/yearly)',
    enum: LoanPeriodEnum,
  })
  periodInstallment?: LoanPeriodEnum;
}
