import { Expense } from 'src/expenses/entities/expense.entity';
import { Income } from 'src/incomes/entities/income.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('bank_cards')
export class BankCards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bank_name', nullable: false })
  bankName: string;

  @Column({ name: 'card_number', nullable: false, length: 16 })
  cardNumber: string;

  @Column({ nullable: true, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;

  @OneToMany(() => Income, (income) => income.bankCard)
  incomes: Income[];

  @OneToMany(() => Expense, (expense) => expense.bankCard)
  expenses: Expense[];
}
