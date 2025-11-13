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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('receivables-debts')
export class ReceivablesDebtsController {
  constructor(
    private readonly receivablesDebtsService: ReceivablesDebtsService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create receivable-debt' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'receivable-debt created successfully',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get receivables-debts by type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'receivables-debts sent successfully',
  })
  @ApiQuery({
    name: 'type',
    enum: ReceivableDebtTypeEnum,
    description: 'type of receivable-debt',
    required: true,
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get receivables-debts by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'receivables-debts sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'receivables-debts not found',
  })
  @ApiQuery({
    name: 'status',
    enum: ReceivableDebtStatusEnum,
    description: 'status of receivables-debts',
    required: true,
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findByStatus(
    @getUser() user: User,
    @Query('type') type: ReceivableDebtTypeEnum,
    @Query('status') status: ReceivableDebtStatusEnum,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const receivablesOrDebts = await this.receivablesDebtsService.getByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      type,
      user,
    );

    return {
      data: receivablesOrDebts,
      statusCode: HttpStatus.OK,
      message: `${type} sent successfully`,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get receivable-debt  by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'receivable-debt  sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'receivable-debt  not found',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update status receivable-debt' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'status receivable-debt updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'receivable-debt not found',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update receivable-debt' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'receivable-debt updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'receivable-debt not found',
  })
  @ApiBody({ type: UpdateReceivableDebtDto, required: false })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete receivable-debt' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'receivable-debt deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'receivable-debt not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'receivable-debt delete faild',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'unAuthorized' })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    const data = await this.receivablesDebtsService.remove(parseInt(id), user);

    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'receivable/debt  removed successfully',
    };
  }
}
