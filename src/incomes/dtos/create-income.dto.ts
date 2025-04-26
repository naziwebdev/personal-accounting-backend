import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Length,
  IsDate,
  IsInt,
} from 'class-validator';

export class CreateIncomeDto {
  @IsString({ message: 'title must be string' })
  @Length(3, 50, { message: 'min length 3 and max length is 50' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @IsDate({ message: 'format must be date' })
  @IsNotEmpty({ message: 'date is required' })
  date: Date;

  @IsOptional()
  description: string;

  @IsInt()
  @IsNotEmpty({ message: 'category id is required' })
  category_id: number;

  @IsInt()
  @IsOptional()
  bankCard_id: number;
}
