import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Repository } from 'typeorm';
import { WatchlistItem } from './entities/watchlist-item.entity';
import { CreateWatchlistDto } from './dtos/create-watchlist.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateWatchlistItemDto } from './dtos/create-watchlist-item.dto';
import { calculateSavings } from './helpers/calculate-savings';

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

  async updateTotalPriceAndSavingsInWatchlist(watchlistId: number) {
    const watchlist = await this.watchlistRepository.findOne({
      relations: ['items'],
      where: { id: watchlistId },
    });

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

    await this.watchlistRepository.update(watchlist.id, {
      requiredSavings: requiredSavingsMoney,
      totalPrice,
    });
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
