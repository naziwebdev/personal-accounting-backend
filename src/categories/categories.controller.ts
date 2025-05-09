import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category-dto';
import { CategoryTypeEnum } from './enums/category-type-enum';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateCategoryDto,
  ) {
    const newCategory = await this.categoriesService.create(body, user);

    return {
      data: newCategory,
      statusCode: HttpStatus.CREATED,
      message: 'category created successfully',
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCatecoriesByType(
    @getUser() user: User,
    @Query('type') type: CategoryTypeEnum,
  ) {
    const categories = await this.categoriesService.findAllByType(type, user);

    return {
      data: categories,
      statusCode: HttpStatus.OK,
      message: 'categoris get successfully',
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Body() body: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    const category = await this.categoriesService.update(
      body,
      parseInt(id),
      user,
    );

    return {
      data: category,
      statusCode: HttpStatus.OK,
      message: 'category updated successfully',
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @getUser() user: User,
    @Param('id') id: string,
  ) {
    await this.categoriesService.remove(parseInt(id), user);

    return {
      data: null,
      statusCode: HttpStatus.OK,
      message: 'category removed successfully',
    }
  }
}
