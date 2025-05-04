import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WatchlistItemStatusEnum } from '../enums/watchlist-status-enum';
import { Watchlist } from './watchlist.entity';

@Entity('watchlist_items')
export class WatchlistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: 1 })
  count: number;

  @Column({
    type: 'enum',
    enum: WatchlistItemStatusEnum,
    default: WatchlistItemStatusEnum.PENDDING,
    nullable: false,
  })
  status: WatchlistItemStatusEnum;


  @ManyToOne(() => Watchlist , (watchlist) => watchlist.items)
  watchlist: Watchlist;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
