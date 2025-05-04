import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWatchlistDto } from './dtos/create-watchlist.dto';
import { Response } from 'express';

@Controller('watchlists')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createWatchlist(
    @getUser() user: User,
    @Body() body: CreateWatchlistDto,
    @Res() res: Response,
  ) {
    const watchlist = await this.watchlistService.createWatchlist(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: watchlist,
      statusCode: HttpStatus.CREATED,
      message: 'watchlist created successfully',
    });
  }
}
