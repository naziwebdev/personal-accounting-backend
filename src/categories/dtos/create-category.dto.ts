import { IsEnum, IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import { CategoryTypeEnum } from '../enums/category-type-enum';

export class CreateCategoryDto {
  @IsString({ message: 'title must be string' })
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsEnum(CategoryTypeEnum, { message: 'type must be income or expense' })
  @IsNotEmpty({ message: 'type is required' })
  @IsString({ message: 'type must be string' })
  type: CategoryTypeEnum;
}
