import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WatchlistStatusEnum } from '../enums/watchlist-status-enum';
import { WatchlistWaitingPeriodEnum } from '../enums/watchlist-waiting-period-enum';
import { User } from 'src/users/entities/user.entity';

@Entity('watchlist')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ name: 'total_price', nullable: false })
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

  @Column({ name: 'required_savings_per_period', nullable: false })
  requiredSavingsPerPeriod: number;

  @ManyToOne(() => User, (user) => user.watchlists)
  user: User;

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
