import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ReceivableDebtTypeEnum } from '../enums/receivable-debt-type-enum';
import { ReceivableDebtStatusEnum } from '../enums/receivable-debt-status';
import { User } from 'src/users/entities/user.entity';

@Entity('receivables-debts')
export class ReceivableDebt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReceivableDebtTypeEnum, nullable: false })
  type: ReceivableDebtTypeEnum;

  @Column({ nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: ReceivableDebtStatusEnum,
    default: ReceivableDebtStatusEnum.PENDDING,
    nullable: false,
  })
  status: ReceivableDebtStatusEnum;

  @Column({ nullable: false })
  person: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.receivablesDebts, { nullable: false })
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
