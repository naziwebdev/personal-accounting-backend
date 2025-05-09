import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReceivablesDebtsService } from './receivables-debts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReceivableDebtDto } from './dtos/create-receivable-debt.dto';
import { ReceivableDebtTypeEnum } from './enums/receivable-debt-type-enum';
import { UpdateReceivableDebtStatusDto } from './dtos/update-receivable-debt-status';
import { UpdateReceivableDebtDto } from './dtos/update-receivable-debt.dto';
import { ReceivableDebtStatusEnum } from './enums/receivable-debt-status';

@Controller('receivables-debts')
export class ReceivablesDebtsController {
  constructor(
    private readonly receivablesDebtsService: ReceivablesDebtsService,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateReceivableDebtDto) {
    const receivableOrDebt = await this.receivablesDebtsService.create(
      body,
      user,
    );

    return {
      data: receivableOrDebt,
      statusCode: HttpStatus.CREATED,
      message: 'receivable/debt created successfully',
    };
  }

  @Get('/type')
  @UseGuards(JwtAuthGuard)
  async findByType(
    @getUser() user: User,
    @Query('type') type: ReceivableDebtTypeEnum,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const receivablesOrDebts = await this.receivablesDebtsService.getByType(
      parseInt(page),
      parseInt(limit),
      user,
      type,
    );

    return {
      data: receivablesOrDebts,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt sent successfully',
    };
  }
  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findByStatus(
    @getUser() user: User,
    @Query('status') status: ReceivableDebtStatusEnum,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const receivablesOrDebts = await this.receivablesDebtsService.getByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return {
      data: receivablesOrDebts,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt sent successfully',
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@getUser() user: User, @Param('id') id: string) {
    const receivablesOrDebts = await this.receivablesDebtsService.getById(
      parseInt(id),
      user,
    );

    return {
      data: receivablesOrDebts,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt sent successfully',
    };
  }

  @Patch('/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateReceivableDebtStatusDto,
  ) {
    const receivableOrDebt = await this.receivablesDebtsService.updateStatus(
      body,
      parseInt(id),
      user,
    );

    return {
      data: receivableOrDebt,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt status updated successfully',
    };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateReceivableDebtDto,
  ) {
    const receivableOrDebt = await this.receivablesDebtsService.update(
      body,
      parseInt(id),
      user,
    );

    return {
      data: receivableOrDebt,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt  updated successfully',
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.receivablesDebtsService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'receivable/debt  removed successfully',
    };
  }
}
