import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WatchlistItemStatusEnum } from '../enums/watchlist-status-enum';

export class UpdateWatchlistItemStatusDto {
  @ApiProperty({ example: 'pending', description: 'Watchlist item status (pending/purchased)', enum: WatchlistItemStatusEnum })
  @IsEnum(WatchlistItemStatusEnum, { message: 'watchlist item status must be pending/purchased' })
  @IsNotEmpty({ message: 'status is required' })
  status: WatchlistItemStatusEnum;
}
