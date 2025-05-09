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

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

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

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.expensesService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'expense deleted successfully',
    };
  }
}
