import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateWatchlistDto } from './create-watchlist.dto';
import { WatchlistWaitingPeriodEnum } from '../enums/watchlist-waiting-period-enum';

export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  @ApiPropertyOptional({ example: 'Tech Gadgets', description: 'Title of the watchlist (length between 3-50)' })
  title?: string;

  @ApiPropertyOptional({ example: 'month', description: 'Waiting period for purchases (day/week/month/year)', enum: WatchlistWaitingPeriodEnum })
  waitingPeriod?: WatchlistWaitingPeriodEnum;

  @ApiPropertyOptional({ example: 5000, description: 'Current budget allocated for the watchlist' })
  currentBudget?: number;
}
