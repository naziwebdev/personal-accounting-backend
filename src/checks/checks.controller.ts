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
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dtos/create-check.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CheckTypeEnum } from './enums/check-type-enum';
import { CheckStatusEnum } from './enums/check-status-enum';
import { UpdateCheckDto } from './dtos/update-check.dto';
import { UpdateStatusCheckDto } from './dtos/update-status-check.dto';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateCheckDto) {
    const check = await this.checksService.create(body, user);

    return {
      data: check,
      statusCode: HttpStatus.CREATED,
      message: 'check created successfully',
    };
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const checks = await this.checksService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: checks,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @Get('/type')
  @UseGuards(JwtAuthGuard)
  async findByType(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type: CheckTypeEnum,
  ) {
    const checks = await this.checksService.getByType(
      parseInt(page),
      parseInt(limit),
      type,
      user,
    );

    return {
      data: checks,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findByStatus(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: CheckStatusEnum,
  ) {
    const checks = await this.checksService.getByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return {
      data: checks,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@getUser() user: User, @Param('id') id: string) {
    const check = await this.checksService.getById(parseInt(id), user);

    return {
      data: check,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateCheckDto,
  ) {
    const check = await this.checksService.update(body, parseInt(id), user);

    return {
      data: check,
      statusCode: HttpStatus.OK,
      message: 'checks updated successfully',
    };
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateStatusCheckDto,
  ) {
    const check = await this.checksService.updateStatus(
      body,
      parseInt(id),
      user,
    );

    return {
      data: check,
      statusCode: HttpStatus.OK,
      message: 'checks status updated successfully',
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.checksService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'checks deleted successfully',
    };
  }
}
