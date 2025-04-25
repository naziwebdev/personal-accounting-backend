import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('bank_cards')
export class BankCards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bank_name', nullable: false })
  bankName: string;

  @Column({ name: 'bank_number', nullable: false })
  bankNumber: string;

  @Column({ nullable: true, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
