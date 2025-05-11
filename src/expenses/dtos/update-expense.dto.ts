import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import { IsString, IsNumber, IsOptional, Length, IsInt, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiPropertyOptional({ example: 'Groceries', description: 'Expense title (min length 3, max length 50)' })
  @IsString({ message: 'title must be string' })
  @IsOptional()
  @Length(3, 50, { message: 'min length 3 and max length is 50' })
  title?: string;

  @ApiPropertyOptional({ example: 500000, description: 'Expense price' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: '2024-05-01T00:00:00.000Z', description: 'Expense date (ISO format)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 'Bought groceries for the week', description: 'Expense description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Category ID' })
  @IsInt()
  @IsOptional()
  category_id?: number;

  @ApiPropertyOptional({ example: 2, description: 'Bank card ID (optional)' })
  @IsInt()
  @IsOptional()
  bankCard_id?: number;
}
