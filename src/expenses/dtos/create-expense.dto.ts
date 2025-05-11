import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Length,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Groceries', description: 'Expense title (min length 3, max length 50)' })
  @IsString({ message: 'title must be string' })
  @Length(3, 50, { message: 'min length 3 and max length is 50' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty({ example: 500000, description: 'Expense price' })
  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @ApiProperty({ example: '2024-05-01T00:00:00.000Z', description: 'Expense date (ISO format)' })
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsNotEmpty({ message: 'date is required' })
  date: string;

  @ApiPropertyOptional({ example: 'Bought groceries for the week', description: 'Expense description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsInt()
  @IsNotEmpty({ message: 'category id is required' })
  category_id: number;

  @ApiPropertyOptional({ example: 2, description: 'Bank card ID (optional)' })
  @IsInt()
  @IsOptional()
  bankCard_id?: number;
}
