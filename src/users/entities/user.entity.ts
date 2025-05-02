import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserRoleEnum } from '../enums/user-role-enum';
import { Category } from 'src/categories/entities/category.entity';
import { BankCards } from 'src/bank-cards/entities/bank-card.entity';
import { Income } from 'src/incomes/entities/income.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Note } from 'src/notes/entities/note.entity';
import { ReceivableDebt } from 'src/receivables-debts/entities/receivable-debt.entity';
import { Check } from 'src/checks/entities/check.entity';
import { Loan } from 'src/loans/entities/loan.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 11, unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
    nullable: false,
  })
  role: UserRoleEnum;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => BankCards, (bankCards) => bankCards.user)
  cards: BankCards[];

  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => ReceivableDebt, (receivableDebt) => receivableDebt.user)
  receivablesDebts: ReceivableDebt[];

  @OneToMany(() => Check, (check) => check.user)
  checks: Check[];

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];

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
