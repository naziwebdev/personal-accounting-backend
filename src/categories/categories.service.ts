import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category-dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('not found category');
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoriesRepository.save(category);
  }
}
