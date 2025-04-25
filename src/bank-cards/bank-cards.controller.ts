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

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAll(@getUser() user: User, @Res() res: Response) {
    const cards = await this.bankCardsService.getAll(user);

    return res.status(HttpStatus.OK).json({
      data: cards,
      statusCode: HttpStatus.OK,
      message: 'cards send successfully',
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const card = await this.bankCardsService.getOne(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: card,
      statusCode: HttpStatus.OK,
      message: 'card send successfully',
    });
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateCardDto,
    @Res() res: Response,
  ) {
    const card = await this.bankCardsService.update(parseInt(id), body, user);

    return res.status(HttpStatus.OK).json({
      data: card,
      statusCode: HttpStatus.OK,
      message: 'card updated successfully',
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.bankCardsService.remove(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: '',
      statusCode: HttpStatus.OK,
      message: 'card deleted successfully',
    });
  }
}
