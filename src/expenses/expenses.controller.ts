import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { Response } from 'express';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateExpenseDto,
    @Res() res: Response,
  ) {
    const expense = await this.expensesService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: expense,
      statusCode: HttpStatus.CREATED,
      message: 'expense created successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const expense = await this.expensesService.findAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: expense,
      statusCode: HttpStatus.OK,
      message: 'expense send successfully',
    });
  }
}
