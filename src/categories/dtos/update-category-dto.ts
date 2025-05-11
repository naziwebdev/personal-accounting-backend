import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryTypeEnum } from '../enums/category-type-enum';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ example: 'Food', description: 'Category title' })
  title?: string;

  @ApiPropertyOptional({ example: 'income', description: 'Category type (income or expense)' })
  type?: CategoryTypeEnum;
}
