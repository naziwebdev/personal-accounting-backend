import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { Response } from 'express';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateReminderDto,
    @Res() res: Response,
  ) {
    const reminder = await this.remindersService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: reminder,
      statusCode: HttpStatus.CREATED,
      message: 'reminder created successfully',
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
    const reminders = await this.remindersService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: reminders,
      statusCode: HttpStatus.OK,
      message: 'reminders sent successfully',
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.remindersService.remove(
      parseInt(id),

      user,
    );

    return res.status(HttpStatus.OK).json({
      data: '',
      statusCode: HttpStatus.OK,
      message: 'reminders deleted successfully',
    });
  }
}
