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
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.gurad';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Response } from 'express';
import { UpdateCategoryDto } from './dtos/update-category-dto';
import { CategoryTypeEnum } from './enums/category-type-enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() body: CreateCategoryDto, @Res() res: Response) {
    const newCategory = await this.categoriesService.create(body);

    return res.status(HttpStatus.CREATED).json({
      data: newCategory,
      statusCode: HttpStatus.CREATED,
      message: 'category created successfully',
    });
  }

  @Get()
  async getCatecoriesByType(
    @Query('type') type: CategoryTypeEnum,
    @Res() res: Response,
  ) {
    const categories = await this.categoriesService.findAllByType(type);

    return res.status(HttpStatus.OK).json({
      data: categories,
      statusCode: HttpStatus.OK,
      message: 'categoris get successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Body() body: UpdateCategoryDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const category = await this.categoriesService.update(body, parseInt(id));

    return res.status(HttpStatus.OK).json({
      data: category,
      statusCode: HttpStatus.OK,
      message: 'category updated successfully',
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
     await this.categoriesService.remove(parseInt(id));

    return res.status(HttpStatus.OK).json({
      data:null,
      statusCode: HttpStatus.OK,
      message: 'category removed successfully',
    });
  }
}
