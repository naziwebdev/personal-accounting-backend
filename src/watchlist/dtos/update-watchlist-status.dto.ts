import { IsEnum, IsNotEmpty } from 'class-validator';
import { WatchlistStatusEnum } from '../enums/watchlist-status-enum';

export class UpdateWatchlistStatusDto {
  @IsEnum(WatchlistStatusEnum, {
    message: 'watchlist item status must be pendding/purchased',
  })
  @IsNotEmpty({ message: 'status is required' })
  status: WatchlistStatusEnum;
}
