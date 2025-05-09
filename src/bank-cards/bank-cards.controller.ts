import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BankCardsService } from './bank-cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateCardDto } from './dtos/update-card.dto';
import { use } from 'passport';

@Controller('cards')
export class BankCardsController {
  constructor(private readonly bankCardsService: BankCardsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateCardDto) {
    const card = await this.bankCardsService.create(body, user);

    return {
      data: card,
      statusCode: HttpStatus.CREATED,
      message: 'card created successfully',
    };
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAll(@getUser() user: User) {
    const cards = await this.bankCardsService.getAll(user);
 
    return {
      data: cards,
      statusCode: HttpStatus.OK,
      message: 'cards send successfully',
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@getUser() user: User, @Param('id') id: string) {
    const card = await this.bankCardsService.getOne(parseInt(id), user);

    return {
      data: card,
      statusCode: HttpStatus.OK,
      message: 'card send successfully',
    };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateCardDto,
  ) {
    const card = await this.bankCardsService.update(parseInt(id), body, user);

    return {
      data: card,
      statusCode: HttpStatus.OK,
      message: 'card updated successfully',
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.bankCardsService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'card deleted successfully',
    };
  }
}
