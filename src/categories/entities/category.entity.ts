import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryTypeEnum } from '../enums/category-type-enum';
import { User } from 'src/users/entities/user.entity';

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
}
