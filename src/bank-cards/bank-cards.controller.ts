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
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateCardDto } from './dtos/update-card.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


@Controller('cards')
export class BankCardsController {
  constructor(private readonly bankCardsService: BankCardsService) {}

  @ApiBearerAuth()
  @Post('/')
  @ApiOperation({ summary: 'create card' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'card created successfully',
  })
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateCardDto) {
    const card = await this.bankCardsService.create(body, user);

    return {
      data: card,
      statusCode: HttpStatus.CREATED,
      message: 'card created successfully',
    };
  }

  @ApiBearerAuth()
  @Get('/')
  @ApiOperation({ summary: 'get all cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'cards sent successfully',
  })
  @UseGuards(JwtAuthGuard)
  async getAll(@getUser() user: User) {
    const cards = await this.bankCardsService.getAll(user);

    return {
      data: cards,
      statusCode: HttpStatus.OK,
      message: 'cards send successfully',
    };
  }

  @ApiBearerAuth()
  @Get('/:id')
  @ApiOperation({ summary: 'get one card by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'card sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'card not found',
  })
  @UseGuards(JwtAuthGuard)
  async getOne(@getUser() user: User, @Param('id') id: string) {
    const card = await this.bankCardsService.getOne(parseInt(id), user);

    return {
      data: card,
      statusCode: HttpStatus.OK,
      message: 'card send successfully',
    };
  }

  @ApiBearerAuth()
  @Put('/:id')
  @ApiBody({ type: UpdateCardDto, required: false })
  @ApiOperation({ summary: 'update card' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'card updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'card not found',
  })
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

  @ApiBearerAuth()
  @Delete('/:id')
  @ApiOperation({ summary: 'delete card' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'card deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'card not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'delete card faild',
  })
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
