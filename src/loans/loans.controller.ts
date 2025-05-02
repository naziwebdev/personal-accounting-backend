import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { Response } from 'express';

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
}
