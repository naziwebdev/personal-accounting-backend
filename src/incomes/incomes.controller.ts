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
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateIncomeDto } from './dtos/update-income.dto';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateIncomeDto,
    @Res() res: Response,
  ) {
    const income = await this.incomesService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: income,
      statusCode: HttpStatus.CREATED,
      message: 'income created successfully',
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
    const incomes = await this.incomesService.findAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: incomes,
      statusCode: HttpStatus.OK,
      message: 'income send successfully',
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const income = await this.incomesService.findOne(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: income,
      statusCode: HttpStatus.OK,
      message: 'income send successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateIncomeDto,
    @Res() res: Response,
  ) {
    const income = await this.incomesService.update(body, parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: income,
      statusCode: HttpStatus.OK,
      message: 'income updated successfully',
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.incomesService.remove(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: '',
      statusCode: HttpStatus.OK,
      message: 'income deleted successfully',
    });
  }
}
