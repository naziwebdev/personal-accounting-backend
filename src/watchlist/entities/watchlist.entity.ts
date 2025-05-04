import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WatchlistStatusEnum } from '../enums/watchlist-status-enum';
import { WatchlistWaitingPeriodEnum } from '../enums/watchlist-waiting-period-enum';
import { User } from 'src/users/entities/user.entity';
import { WatchlistItem } from './watchlist-item.entity';

@Entity('watchlists')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ name: 'total_price', nullable: true })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: WatchlistStatusEnum,
    default: WatchlistStatusEnum.PENDDING,
    nullable: false,
  })
  status: WatchlistStatusEnum;

  @Column({
    name: 'waiting_period',
    type: 'enum',
    enum: WatchlistWaitingPeriodEnum,
    nullable: false,
  })
  waitingPeriod: WatchlistWaitingPeriodEnum;

  @Column({ name: 'current_budget', nullable: false })
  currentBudget: number;

  @Column({ name: 'required_savings_per_day', nullable: true })
  requiredSavingsPerDay: number;

  @ManyToOne(() => User, (user) => user.watchlists)
  user: User;

  @OneToMany(() => WatchlistItem, (watchlistItem) => watchlistItem.watchlist)
  items: WatchlistItem[];

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
