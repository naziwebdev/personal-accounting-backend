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
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateIncomeDto } from './dtos/update-income.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create income' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'imcome created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found bank-card',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found category',
  })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateIncomeDto) {
    const income = await this.incomesService.create(body, user);

    return {
      data: income,
      statusCode: HttpStatus.CREATED,
      message: 'income created successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all incomes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'incomes sent successfully',
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const incomes = await this.incomesService.findAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: incomes,
      statusCode: HttpStatus.OK,
      message: 'income send successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get income by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'income sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found income',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unAuthorized',
  })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@getUser() user: User, @Param('id') id: string) {
    const income = await this.incomesService.findOne(parseInt(id), user);

    return {
      data: income,
      statusCode: HttpStatus.OK,
      message: 'income send successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update income' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'income updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found income',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found bank-card',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found category',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unAuthorized',
  })
  @ApiBody({ type: UpdateIncomeDto, required: false })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateIncomeDto,
  ) {
    const income = await this.incomesService.update(body, parseInt(id), user);

    return {
      data: income,
      statusCode: HttpStatus.OK,
      message: 'income updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete income' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'income deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found income',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'delete income faild',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unAuthorized',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    const data = await this.incomesService.remove(parseInt(id), user);

    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'income deleted successfully',
    };
  }
}
