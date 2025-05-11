import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { WatchlistWaitingPeriodEnum } from '../enums/watchlist-waiting-period-enum';

export class CreateWatchlistDto {
  @ApiProperty({ example: 'Tech Gadgets', description: 'Title of the watchlist (length between 3-50)' })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  @Length(3, 50, { message: 'min & max title length must be btw 3-50 chars' })
  title: string;

  @ApiProperty({ example: 'month', description: 'Waiting period for purchases (day/week/month/year)', enum: WatchlistWaitingPeriodEnum })
  @IsEnum(WatchlistWaitingPeriodEnum, { message: 'waiting-period must be day/week/month/year' })
  @IsNotEmpty({ message: 'waiting-period is required' })
  waitingPeriod: WatchlistWaitingPeriodEnum;

  @ApiProperty({ example: 5000, description: 'Current budget allocated for the watchlist' })
  @IsNumber()
  @IsNotEmpty({ message: 'current budget is required' })
  currentBudget: number;
}
