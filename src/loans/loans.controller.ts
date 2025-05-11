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
import { LoansService } from './loans.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { LoanStatusEnum } from './enums/loan-status-enum';
import { UpdateLoanDto } from './dtos/update-loan.dto';
import { UpdateStatusInstallment } from './dtos/update-installment-status.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create loan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'loan created successfully',
  })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateLoanDto) {
    const loan = await this.loansService.create(body, user);

    return {
      data: loan,
      statusCode: HttpStatus.CREATED,
      message: 'loan created successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all loans' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'loans sent successfully',
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const loans = await this.loansService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: loans,
      statusCode: HttpStatus.OK,
      message: 'loans sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get loans by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'loans sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found loan',
  })
  @ApiQuery({
    name: 'status',
    enum: LoanStatusEnum,
    description: 'status',
    required: true,
  })
  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findByStatus(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: LoanStatusEnum,
  ) {
    const loans = await this.loansService.getByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return {
      data: loans,
      statusCode: HttpStatus.OK,
      message: 'loans sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get loans by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'loans sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found loan',
  })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@getUser() user: User, @Param('id') id: string) {
    const loan = await this.loansService.getOne(parseInt(id), user);

    return {
      data: loan,
      statusCode: HttpStatus.OK,
      message: 'loan sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update loan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'loan updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found loan',
  })
  @ApiBody({ type: UpdateLoanDto, required: false })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateLoanDto,
  ) {
    const loanUpdated = await this.loansService.update(
      body,
      parseInt(id),
      user,
    );

    return {
      data: loanUpdated,
      statusCode: HttpStatus.OK,
      message: 'loan updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update status installment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'installment status updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found loan',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found installment',
  })
  @Patch('/installment/:id')
  @UseGuards(JwtAuthGuard)
  async updateStatusInstallment(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateStatusInstallment,
  ) {
    const installmentUpdated = await this.loansService.updateInstallmentStatus(
      parseInt(id),
      body.status,
      user,
    );

    return {
      data: installmentUpdated,
      statusCode: HttpStatus.OK,
      message: 'installment status  updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete loan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'loan deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found loan',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found installment',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'delete loan faild',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.loansService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'loan deleted successfully',
    };
  }
}
