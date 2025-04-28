import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryTypeEnum } from '../enums/category-type-enum';
import { User } from 'src/users/entities/user.entity';
import { Income } from 'src/incomes/entities/income.entity';
import { Expense } from 'src/expenses/entities/expense.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'enum', enum: CategoryTypeEnum, nullable: false })
  type: CategoryTypeEnum;

  @ManyToOne(() => User, (user) => user.categories, { nullable: true })
  user: User | null;

  @OneToMany(() => Income, (income) => income.category)
  incomes: Income[];

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];
}
