import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Repository } from 'typeorm';
import { WatchlistItem } from './entities/watchlist-item.entity';
import { CreateWatchlistDto } from './dtos/create-watchlist.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateWatchlistItemDto } from './dtos/create-watchlist-item.dto';
import { calculateSavings } from './helpers/calculate-savings';
import { UpdateWatchlistDto } from './dtos/update-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(WatchlistItem)
    private watchlistItemsRepository: Repository<WatchlistItem>,
  ) {}

  async createWatchlist(createWatchlist: CreateWatchlistDto, user: User) {
    const watchlist = await this.watchlistRepository.create({
      ...createWatchlist,
      user,
    });

    return await this.watchlistRepository.save(watchlist);
  }

  async updateTotalPriceAndSavingsInWatchlist(watchlist: Watchlist) {
    if (!watchlist) {
      throw new NotFoundException('not found watchlist');
    }

    const totalPrice =
      watchlist.items?.reduce(
        (total, value) => total + value.count * value.price,
        0,
      ) || 0;

    const requiredSavingsMoney =
      totalPrice > watchlist.currentBudget
        ? calculateSavings(
            totalPrice,
            watchlist.waitingPeriod,
            watchlist.currentBudget,
          )
        : 0;

    watchlist.totalPrice = totalPrice;
    watchlist.requiredSavingsPerDay = requiredSavingsMoney;

    return await this.watchlistRepository.save(watchlist);
  }

  async getOneWatchlist(id: number, user: User) {
    const watchlist = await this.watchlistRepository.findOne({
      relations: ['items'],
      where: { id, user: { id: user.id } },
    });

    if (!watchlist) {
      throw new NotFoundException('not found watchlist');
    }

    const updatedWatchlist =
      await this.updateTotalPriceAndSavingsInWatchlist(watchlist);

    return updatedWatchlist;
  }

  async getAllWatchlists(page: number, limit: number, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const watchlists = await this.watchlistRepository.find({
      relations: ['items'],
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    const watchlistsUpdateField = await Promise.all(
      watchlists?.map(async (watchlist) => {
        return this.updateTotalPriceAndSavingsInWatchlist(watchlist);
      }),
    );

    return watchlistsUpdateField;
  }

  async updateWatchlist(
    updatedWatchlistDto: UpdateWatchlistDto,
    id: number,
    user: User,
  ) {
    const watchlist = await this.watchlistRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!watchlist) {
      throw new NotFoundException('not found watchlist');
    }

    Object.assign(watchlist, updatedWatchlistDto);

    return await this.watchlistRepository.save(watchlist);
  }

  async createItem(createItemDto: CreateWatchlistItemDto, user: User) {
    const watchlist = await this.watchlistRepository.findOne({
      where: { user: { id: user.id }, id: createItemDto.watchlistId },
    });

    if (!watchlist) {
      throw new NotFoundException('not found watchlist');
    }

    const watchlistItem = await this.watchlistItemsRepository.create({
      title: createItemDto.title,
      price: createItemDto.price,
      count: createItemDto.count,
      description: createItemDto.description,
      status: createItemDto.status,
      watchlist,
    });

    return await this.watchlistItemsRepository.save(watchlistItem);
  }
}
