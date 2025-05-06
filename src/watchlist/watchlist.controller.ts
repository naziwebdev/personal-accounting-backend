import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWatchlistDto } from './dtos/create-watchlist.dto';
import { Response } from 'express';
import { CreateWatchlistItemDto } from './dtos/create-watchlist-item.dto';
import { UpdateWatchlistDto } from './dtos/update-watchlist.dto';
import { UpdateWatchlistStatusDto } from './dtos/update-watchlist-status.dto';
import { UpdateWatchlistItemDto } from './dtos/update-watchlist-item.dto';
import { UpdateWatchlistItemStatusDto } from './dtos/update-watchlist-item-status.dto';
import { WatchlistStatusEnum } from './enums/watchlist-status-enum';

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

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findWatchlists(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const watchlists = await this.watchlistService.getAllWatchlists(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: watchlists,
      statusCode: HttpStatus.OK,
      message: 'watchlists sent successfully',
    });
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findWatchlistsByStatus(
    @getUser() user: User,
    @Query('status') status: WatchlistStatusEnum,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const watchlists = await this.watchlistService.getWatchlistsByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: watchlists,
      statusCode: HttpStatus.OK,
      message: 'watchlists sent successfully',
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOneWatchlist(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const watchlist = await this.watchlistService.getOneWatchlist(
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: watchlist,
      statusCode: HttpStatus.OK,
      message: 'watchlist sent successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWatchlist(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistDto,
    @Res() res: Response,
  ) {
    const watchlist = await this.watchlistService.updateWatchlist(
      body,
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: watchlist,
      statusCode: HttpStatus.OK,
      message: 'watchlist updated successfully',
    });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWatchlistStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistStatusDto,
    @Res() res: Response,
  ) {
    const watchlist = await this.watchlistService.updateWatchlistStatus(
      body,
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: watchlist,
      statusCode: HttpStatus.OK,
      message: 'watchlist status updated successfully',
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async removeWatchlist(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.watchlistService.removeWatchlist(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: '',
      statusCode: HttpStatus.OK,
      message: 'watchlist deleted successfully',
    });
  }

  @Post('/item')
  @UseGuards(JwtAuthGuard)
  async createItem(
    @getUser() user: User,
    @Body() body: CreateWatchlistItemDto,
    @Res() res: Response,
  ) {
    const item = await this.watchlistService.createItem(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: item,
      statusCode: HttpStatus.CREATED,
      message: 'watchlist item created successfully',
    });
  }

  @Put('/item/:id')
  @UseGuards(JwtAuthGuard)
  async updateWatchlistItem(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistItemDto,
    @Res() res: Response,
  ) {
    const item = await this.watchlistService.updateItem(
      body,
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: item,
      statusCode: HttpStatus.OK,
      message: 'item updated successfully',
    });
  }

  @Patch('/item/:id')
  @UseGuards(JwtAuthGuard)
  async updateItemStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistItemStatusDto,
    @Res() res: Response,
  ) {
    const item = await this.watchlistService.updateItemStatus(
      body,
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: item,
      statusCode: HttpStatus.OK,
      message: 'watchlist item status updated successfully',
    });
  }

  @Delete('/item/:id')
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.watchlistService.removeItem(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: '',
      statusCode: HttpStatus.OK,
      message: 'watchlist item deleted successfully',
    });
  }
}
