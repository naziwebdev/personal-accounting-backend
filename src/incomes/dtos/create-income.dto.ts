import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Length,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateIncomeDto {
  @IsString({ message: 'title must be string' })
  @Length(3, 50, { message: 'min length 3 and max length is 50' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsDateString()
  @IsNotEmpty({ message: 'date is required' })
  date: string; 

  @IsOptional()
  description: string;

  @IsInt()
  @IsNotEmpty({ message: 'category id is required' })
  category_id: number;

  @IsInt()
  @IsOptional()
  bankCard_id: number;
}
