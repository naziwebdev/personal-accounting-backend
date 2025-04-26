import { BankCards } from 'src/bank-cards/entities/bank-card.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

Entity('incomes');
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: 'decimal' })
  price: number;

  @Column({ nullable: false, type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.incomes, { nullable: false })
  user: User;

  @ManyToOne(() => Category, (category) => category.incomes, {
    nullable: false,
  })
  category: Category;

  @ManyToOne(() => BankCards, (bankCards) => bankCards.incomes, {
    nullable: true,
  })
  bankCard: BankCards;

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
