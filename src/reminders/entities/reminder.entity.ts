import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReminderTypeEnum } from '../enums/reminder-type-enum';
import { User } from 'src/users/entities/user.entity';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ type: 'enum', enum: ReminderTypeEnum, nullable: false })
  type: ReminderTypeEnum;

  @ManyToOne(() => User, (user) => user.reminders)
  user: User;

  @Column({ type: 'boolean', default: false })
  isSent: boolean;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ nullable: false })
  entityId: number;

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
