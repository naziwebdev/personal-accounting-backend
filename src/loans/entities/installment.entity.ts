import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InstallmentStatusEnum } from '../enums/loan-status-enum';
import { Loan } from './loan.entity';

@Entity('installments')
export class Installment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: InstallmentStatusEnum,
    default: InstallmentStatusEnum.PENDDING,
    nullable: false,
  })
  status: InstallmentStatusEnum;

  @Column({ name: 'due_date', type: 'timestamp', nullable: false })
  dueDate: Date;

  @ManyToOne(() => Loan, (loan) => loan.installments)
  loan: Loan;
}
