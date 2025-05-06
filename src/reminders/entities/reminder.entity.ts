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

  @Column({ name:'is_sent',type: 'boolean', default: false })
  isSent: boolean;

  @Column({ name:'due_date',type: 'timestamp' })
  dueDate: Date;

  @Column({ name:'entity_id',nullable: false })
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
