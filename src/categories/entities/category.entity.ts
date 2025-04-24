import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryTypeEnum } from '../enums/category-type-enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'enum', enum: CategoryTypeEnum, nullable: false })
  type: CategoryTypeEnum;
}
