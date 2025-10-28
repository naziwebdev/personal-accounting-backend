import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryTypeEnum } from '../enums/category-type-enum';

export class CreateCategoryDto {
  @ApiProperty({ example: 'food', description: 'category title' })
  @IsString({ message: 'title must be string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty({
    example: 'income',
    description: 'category type (income or expense)',
    enum: CategoryTypeEnum,
  })
  @IsEnum(CategoryTypeEnum, { message: 'type must be income or expense' })
  @IsNotEmpty({ message: 'type is required' })
  type: CategoryTypeEnum;

  @IsOptional()
  @IsString()
  icon?: string;
}
