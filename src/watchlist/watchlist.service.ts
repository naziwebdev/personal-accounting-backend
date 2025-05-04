import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Repository } from 'typeorm';
import { WatchlistItem } from './entities/watchlist-item.entity';
import { CreateWatchlistDto } from './dtos/create-watchlist.dto';
import { User } from 'src/users/entities/user.entity';

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
}
