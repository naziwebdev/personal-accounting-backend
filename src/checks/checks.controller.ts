import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dtos/create-check.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CheckTypeEnum } from './enums/check-type-enum';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateCheckDto,
    @Res() res: Response,
  ) {
    const check = await this.checksService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: check,
      statusCode: HttpStatus.CREATED,
      message: 'check created successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const checks = await this.checksService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: checks,
      statusCode: HttpStatus.CREATED,
      message: 'checks sent successfully',
    });
  }

  @Get('/type')
  @UseGuards(JwtAuthGuard)
  async findByType(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type: CheckTypeEnum,
    @Res() res: Response,
  ) {
    const checks = await this.checksService.getByType(
      parseInt(page),
      parseInt(limit),
      type,
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: checks,
      statusCode: HttpStatus.CREATED,
      message: 'checks sent successfully',
    });
  }
}
