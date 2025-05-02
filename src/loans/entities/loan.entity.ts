import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoanStatusEnum } from '../enums/loan-status-enum';
import { LoanPeriodEnum } from '../enums/loan-period-enum';
import { User } from 'src/users/entities/user.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ name: 'giver_name', nullable: false })
  giverName: string;

  @Column({ name: 'total_price', type: 'decimal', nullable: false })
  totalPrice: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: LoanStatusEnum,
    default: LoanStatusEnum.PENDDING,
    nullable: false,
  })
  status: LoanStatusEnum;

  @Column({ name: 'count_installment', nullable: false })
  countInstallment: number;

  @Column({
    name: 'first_date_installment',
    type: 'timestamp',
    nullable: false,
  })
  firstDateInstallment: Date;

  @Column({
    name: 'period_installment',
    type: 'enum',
    enum: LoanPeriodEnum,
    default: LoanPeriodEnum.MONTHLY,
    nullable: false,
  })
  periodInstallment: LoanPeriodEnum;

  @ManyToOne(() => User, (user) => user.loans)
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
