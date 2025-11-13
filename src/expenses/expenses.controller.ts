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
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create expense' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'expense created successfully',
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
  async create(@getUser() user: User, @Body() body: CreateExpenseDto) {
    const expense = await this.expensesService.create(body, user);

    return {
      data: expense,
      statusCode: HttpStatus.CREATED,
      message: 'expense created successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all expenses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'expenses sent successfully',
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
    const expense = await this.expensesService.findAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: expense,
      statusCode: HttpStatus.OK,
      message: 'expense send successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get expense by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'expense sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found expense',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unAuthorized',
  })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@getUser() user: User, @Param('id') id: string) {
    const expense = await this.expensesService.findOne(parseInt(id), user);

    return {
      data: expense,
      statusCode: HttpStatus.OK,
      message: 'expense send successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update expense' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'expense updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found expense',
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
  @ApiBody({ type: UpdateExpenseDto, required: false })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateExpenseDto,
  ) {
    const expense = await this.expensesService.update(body, parseInt(id), user);

    return {
      data: expense,
      statusCode: HttpStatus.OK,
      message: 'expense updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete expense' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'expense deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found expense',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'delete expense faild',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unAuthorized',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    const data = await this.expensesService.remove(parseInt(id), user);

    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'expense deleted successfully',
    };
  }
}
