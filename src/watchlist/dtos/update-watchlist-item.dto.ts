import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { WatchlistItemStatusEnum } from '../enums/watchlist-status-enum';

export class UpdateWatchlistItemDto {
  @IsString()
  @IsOptional({ message: 'title is required' })
  @Length(3, 50, { message: 'min & max title length must be btw 3-50 chars' })
  title: string;

  @IsNumber()
  @IsOptional({
    message: 'price is required',
  })
  price: number;

  @IsInt()
  @IsOptional({
    message: 'count is required',
  })
  count: number;

  @IsString()
  @IsOptional()
  @Length(3, 2500, { message: 'min & max title length must be btw 3-50 chars' })
  description: string;
}
