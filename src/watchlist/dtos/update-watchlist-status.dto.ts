import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WatchlistStatusEnum } from '../enums/watchlist-status-enum';

export class UpdateWatchlistStatusDto {
  @ApiProperty({ example: 'pending', description: 'Watchlist status (pending/purchased)', enum: WatchlistStatusEnum })
  @IsEnum(WatchlistStatusEnum, { message: 'watchlist status must be pending/purchased' })
  @IsNotEmpty({ message: 'status is required' })
  status: WatchlistStatusEnum;
}
