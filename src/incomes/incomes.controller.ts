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

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

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

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.incomesService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'income deleted successfully',
    };
  }
}
