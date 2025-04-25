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
