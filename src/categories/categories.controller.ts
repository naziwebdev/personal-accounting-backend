import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.gurad';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Response } from 'express';
import { UpdateCategoryDto } from './dtos/update-category-dto';

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
}
