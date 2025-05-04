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
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @Length(3, 50, { message: 'min & max title length must be btw 3-50 chars' })
  title: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'price is required',
  })
  price: number;

  @IsInt()
  @IsNotEmpty({
    message: 'count is required',
  })
  count: number;

  @IsString()
  @IsOptional()
  @Length(3, 2500, { message: 'min & max title length must be btw 3-50 chars' })
  description: string;

  @IsEnum(WatchlistItemStatusEnum, {
    message: 'watchlist item status must be pendding/purchased',
  })
  status: WatchlistItemStatusEnum;

  @IsInt()
  @IsNotEmpty({ message: 'watchlist id is required' })
  watchlistId: number;
}
