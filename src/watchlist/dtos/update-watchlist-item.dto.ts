import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateWatchlistItemDto {
  @ApiPropertyOptional({ example: 'Laptop', description: 'Title of the watchlist item (length between 3-50)' })
  @IsString()
  @IsOptional()
  @Length(3, 50, { message: 'min & max title length must be btw 3-50 chars' })
  title?: string;

  @ApiPropertyOptional({ example: 1500, description: 'Price of the watchlist item' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 2, description: 'Quantity of the item' })
  @IsInt()
  @IsOptional()
  count?: number;

  @ApiPropertyOptional({ example: 'High-performance gaming laptop', description: 'Description of the item (length between 3-2500)' })
  @IsString()
  @IsOptional()
  @Length(3, 2500, { message: 'min & max description length must be btw 3-2500 chars' })
  description?: string;
}
