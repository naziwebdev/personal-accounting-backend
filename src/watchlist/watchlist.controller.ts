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
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWatchlistDto } from './dtos/create-watchlist.dto';
import { CreateWatchlistItemDto } from './dtos/create-watchlist-item.dto';
import { UpdateWatchlistDto } from './dtos/update-watchlist.dto';
import { UpdateWatchlistStatusDto } from './dtos/update-watchlist-status.dto';
import { UpdateWatchlistItemDto } from './dtos/update-watchlist-item.dto';
import { UpdateWatchlistItemStatusDto } from './dtos/update-watchlist-item-status.dto';
import { WatchlistStatusEnum } from './enums/watchlist-status-enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('watchlists')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create watchlist' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'watchlist created successfully',
  })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createWatchlist(
    @getUser() user: User,
    @Body() body: CreateWatchlistDto,
  ) {
    const watchlist = await this.watchlistService.createWatchlist(body, user);

    return {
      data: watchlist,
      statusCode: HttpStatus.CREATED,
      message: 'watchlist created successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all watchlists' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlists sent successfully',
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findWatchlists(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const watchlists = await this.watchlistService.getAllWatchlists(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: watchlists,
      statusCode: HttpStatus.OK,
      message: 'watchlists sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get watchlists by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlists sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'watchlist not found',
  })
  @ApiQuery({
    name: 'status',
    enum: WatchlistStatusEnum,
    description: 'status of watchlist',
    required: true,
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findWatchlistsByStatus(
    @getUser() user: User,
    @Query('status') status: WatchlistStatusEnum,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const watchlists = await this.watchlistService.getWatchlistsByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return {
      data: watchlists,
      statusCode: HttpStatus.OK,
      message: 'watchlists sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get watchlist by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlist sent successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOneWatchlist(@getUser() user: User, @Param('id') id: string) {
    const watchlist = await this.watchlistService.getOneWatchlist(
      parseInt(id),
      user,
    );

    return {
      data: watchlist,
      statusCode: HttpStatus.OK,
      message: 'watchlist sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update watchlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlist updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @ApiBody({ type: UpdateWatchlistDto, required: false })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWatchlist(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistDto,
  ) {
    const watchlist = await this.watchlistService.updateWatchlist(
      body,
      parseInt(id),
      user,
    );

    return {
      data: watchlist,
      statusCode: HttpStatus.OK,
      message: 'watchlist updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update status watchlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'status watchlist updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWatchlistStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistStatusDto,
  ) {
    const watchlist = await this.watchlistService.updateWatchlistStatus(
      body,
      parseInt(id),
      user,
    );

    return {
      data: watchlist,
      statusCode: HttpStatus.OK,
      message: 'watchlist status updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete watchlist' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlist deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'watchlist not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'watchlist delete faild',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async removeWatchlist(@getUser() user: User, @Param('id') id: string) {
    await this.watchlistService.removeWatchlist(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'watchlist deleted successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create watchlist items' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'watchlist item created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found watchlist',
  })
  @Post('/item')
  @UseGuards(JwtAuthGuard)
  async createItem(
    @getUser() user: User,
    @Body() body: CreateWatchlistItemDto,
  ) {
    const item = await this.watchlistService.createItem(body, user);

    return {
      data: item,
      statusCode: HttpStatus.CREATED,
      message: 'watchlist item created successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update watchlist item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlist item updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'watchlist item not found',
  })
  @ApiBody({ type: UpdateWatchlistItemDto, required: false })
  @Put('/item/:id')
  @UseGuards(JwtAuthGuard)
  async updateWatchlistItem(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistItemDto,
  ) {
    const item = await this.watchlistService.updateItem(
      body,
      parseInt(id),
      user,
    );

    return {
      data: item,
      statusCode: HttpStatus.OK,
      message: 'item updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update status watchlist item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'status watchlist item updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'watchlist item not found',
  })
  @Patch('/item/:id')
  @UseGuards(JwtAuthGuard)
  async updateItemStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistItemStatusDto,
  ) {
    const item = await this.watchlistService.updateItemStatus(
      body,
      parseInt(id),
      user,
    );

    return {
      data: item,
      statusCode: HttpStatus.OK,
      message: 'watchlist item status updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete watchlist item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'watchlist item deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'watchlist item not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'watchlist item delete faild',
  })
  @Delete('/item/:id')
  @UseGuards(JwtAuthGuard)
  async removeItem(@getUser() user: User, @Param('id') id: string) {
    await this.watchlistService.removeItem(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'watchlist item deleted successfully',
    };
  }
}
