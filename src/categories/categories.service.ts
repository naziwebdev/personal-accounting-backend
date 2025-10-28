import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category-dto';
import { CategoryTypeEnum } from './enums/category-type-enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User | null) {
    if (user?.role === 'admin') {
      user = null;
    }
    const category = await this.categoriesRepository.create({
      title: createCategoryDto.title,
      type: createCategoryDto.type,
      icon: createCategoryDto.icon,
      user,
    });
    return await this.categoriesRepository.save(category);
  }

  async findAllByType(type: CategoryTypeEnum, user: User | null) {
    const defaultCategories = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.type = :type', { type })
      .andWhere('category.user IS NULL')
      .getMany();

    const userCategories = await this.categoriesRepository.find({
      where: {
        type,
        user: { id: user?.id },
      },
    });

    return [...defaultCategories, ...userCategories];
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number, user: User) {
    let category = null;

    if (user.role === 'admin') {
      category = await this.categoriesRepository.findOne({
        where: { id },
      });
    }
    if (user.role === 'user') {
      category = await this.categoriesRepository.findOne({
        relations: ['user'],
        where: { id, user: { id: user.id } },
      });
    }

    if (!category) {
      throw new NotFoundException('not found category');
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoriesRepository.save(category);
  }

  async remove(id: number, user: User) {
    let category = null;

    if (user.role === 'admin') {
      category = await this.categoriesRepository.findOne({
        where: { id },
      });
    }
    if (user.role === 'user') {
      category = await this.categoriesRepository.findOne({
        relations: ['user'],
        where: { id, user: { id: user.id } },
      });
    }
    if (!category) {
      throw new NotFoundException('not found category');
    }

    try {
      await this.categoriesRepository.remove(category);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete');
    }
  }

  async findById(id: number, type: CategoryTypeEnum) {
    const category = await this.categoriesRepository.findOne({
      where: { id, type },
    });

    return category;
  }
}
