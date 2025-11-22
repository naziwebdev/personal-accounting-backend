import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { WatchlistItemStatusEnum } from '../enums/watchlist-status-enum';

export class CreateWatchlistItemDto {
  @ApiProperty({ example: 'Laptop', description: 'Title of the watchlist item (length between 3-50)' })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @Length(3, 50, { message: 'min & max title length must be btw 3-50 chars' })
  title: string;

  @ApiProperty({ example: 1500, description: 'Price of the watchlist item' })
  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @ApiProperty({ example: 2, description: 'Quantity of the item' })
  @IsInt()
  @IsNotEmpty({ message: 'count is required' })
  count: number;

  @ApiProperty({ example: 'High-performance gaming laptop', description: 'Description of the item (length between 3-2500)' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'pending', description: 'Watchlist item status (pending/purchased)', enum: WatchlistItemStatusEnum })
  @IsEnum(WatchlistItemStatusEnum, { message: 'watchlist item status must be pending/purchased' })
  @IsNotEmpty({ message: 'status is required' })
  status: WatchlistItemStatusEnum;

  @ApiProperty({ example: 1, description: 'Watchlist ID associated with the item' })
  @IsInt()
  @IsNotEmpty({ message: 'watchlist id is required' })
  watchlistId: number;
}
