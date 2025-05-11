import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateIncomeDto } from './create-income.dto';

export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {
  @ApiPropertyOptional({
    example: 'Salary',
    description: 'Income title (min length 3, max length 50)',
  })
  title?: string;

  @ApiPropertyOptional({ example: 500000, description: 'Income amount' })
  price?: number;

  @ApiPropertyOptional({
    example: '2024-05-01T00:00:00.000Z',
    description: 'Income date (ISO format)',
  })
  date?: string;

  @ApiPropertyOptional({
    example: 'Monthly salary payment',
    description: 'Income description',
  })
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Category ID' })
  category_id?: number;

  @ApiPropertyOptional({ example: 2, description: 'Bank card ID (optional)' })
  bankCard_id?: number;
}
