import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CheckTypeEnum } from '../enums/check-type-enum';
import { CheckStatusEnum } from '../enums/check-status-enum';
import { User } from 'src/users/entities/user.entity';

@Entity('checks')
export class Check {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CheckTypeEnum, nullable: false })
  type: CheckTypeEnum;

  @Column({
    type: 'enum',
    enum: CheckStatusEnum,
    default: CheckStatusEnum.PENDDING,
    nullable: false,
  })
  status: CheckStatusEnum;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ nullable: false })
  bank: string;

  @Column({ nullable: false })
  payable: string;

  @Column({ nullable: false })
  issued: string;

  @Column({ type: 'timestamp', nullable: false })
  due_date: Date;

  @Column({ nullable: true })
  serial: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.checks)
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
