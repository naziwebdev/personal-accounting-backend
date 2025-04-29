import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReceivablesDebtsService } from './receivables-debts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReceivableDebtDto } from './dtos/create-receivable-debt.dto';
import { Response } from 'express';
import { ReceivableDebtTypeEnum } from './enums/receivable-debt-type-enum';

@Controller('receivables-debts')
export class ReceivablesDebtsController {
  constructor(
    private readonly receivablesDebtsService: ReceivablesDebtsService,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateReceivableDebtDto,
    @Res() res: Response,
  ) {
    const receivableOrDebt = await this.receivablesDebtsService.create(
      body,
      user,
    );

    return res.status(HttpStatus.CREATED).json({
      data: receivableOrDebt,
      statusCode: HttpStatus.CREATED,
      message: 'receivable/debt created successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findByType(
    @getUser() user: User,
    @Query('type') type: ReceivableDebtTypeEnum,
    @Res() res: Response,
  ) {
    const receivablesOrDebts = await this.receivablesDebtsService.getByType(
      user,
      type,
    );

    return res.status(HttpStatus.OK).json({
      data: receivablesOrDebts,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt sent successfully',
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const receivablesOrDebts = await this.receivablesDebtsService.getById(
      parseInt(id),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: receivablesOrDebts,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt sent successfully',
    });
  }
}
