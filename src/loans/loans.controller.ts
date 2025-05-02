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
import { LoansService } from './loans.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { Response } from 'express';
import { LoanStatusEnum } from './enums/loan-status-enum';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateLoanDto,
    @Res() res: Response,
  ) {
    const loan = await this.loansService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: loan,
      statusCode: HttpStatus.CREATED,
      message: 'loan created successfully',
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
    const loans = await this.loansService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: loans,
      statusCode: HttpStatus.OK,
      message: 'loans sent successfully',
    });
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findByStatus(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: LoanStatusEnum,
    @Res() res: Response,
  ) {
    const loans = await this.loansService.getByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: loans,
      statusCode: HttpStatus.OK,
      message: 'loans sent successfully',
    });
  }
}
