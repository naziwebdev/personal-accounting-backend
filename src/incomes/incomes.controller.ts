import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';

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
}
