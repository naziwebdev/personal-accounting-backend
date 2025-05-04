import { IsEnum, IsNotEmpty } from 'class-validator';
import { WatchlistItemStatusEnum } from '../enums/watchlist-status-enum';

export class UpdateWatchlistItemStatusDto {
  @IsEnum(WatchlistItemStatusEnum, {
    message: 'watchlist item status must be pendding/purchased',
  })
  @IsNotEmpty({ message: 'status is required' })
  status: WatchlistItemStatusEnum;
}
