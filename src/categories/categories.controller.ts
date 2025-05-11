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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'category created successfully',
  })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateCategoryDto) {
    const newCategory = await this.categoriesService.create(body, user);

    return {
      data: newCategory,
      statusCode: HttpStatus.CREATED,
      message: 'category created successfully',
    };
  }

  @ApiQuery({
    name: 'type',
    enum: CategoryTypeEnum,
    description: 'Category type (income or expense)',
    required: true,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get categories by type' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'categories sent successfully',
  })
  @Get('/')
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
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'category updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'category not found',
  })
  @ApiBody({ type: UpdateCategoryDto, required: false })
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
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'category not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'category delete faild',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.categoriesService.remove(parseInt(id), user);

    return {
      data: null,
      statusCode: HttpStatus.OK,
      message: 'category removed successfully',
    };
  }
}
