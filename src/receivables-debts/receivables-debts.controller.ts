import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReceivablesDebtsService } from './receivables-debts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReceivableDebtDto } from './dtos/create-receivable-debt.dto';
import { Response } from 'express';

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
}
