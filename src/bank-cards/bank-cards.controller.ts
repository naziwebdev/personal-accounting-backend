import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BankCardsService } from './bank-cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('cards')
export class BankCardsController {
  constructor(private readonly bankCardsService: BankCardsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateCardDto,
    @Res() res: Response,
  ) {
    const card = await this.bankCardsService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: card,
      statusCode: HttpStatus.CREATED,
      message: 'card created successfully',
    });
  }
}
