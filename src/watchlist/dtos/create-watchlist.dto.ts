import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { WatchlistWaitingPeriodEnum } from '../enums/watchlist-waiting-period-enum';

export class CreateWatchlistDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @Length(3, 50, { message: 'min & max title length must be btw 3-50 chars' })
  title: string;

  @IsEnum(WatchlistWaitingPeriodEnum, {
    message: 'waiting-period must be day/week/month/year',
  })
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  waitingPeriod: WatchlistWaitingPeriodEnum;

  @IsNumber()
  @IsNotEmpty({ message: 'current budget is required' })
  currentBudget: number;
}
