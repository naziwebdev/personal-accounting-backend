import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReminderDto } from './dtos/create-reminder.dto';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateReminderDto) {
    const reminder = await this.remindersService.create(body, user);

    return {
      data: reminder,
      statusCode: HttpStatus.CREATED,
      message: 'reminder created successfully',
    };
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const reminders = await this.remindersService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: reminders,
      statusCode: HttpStatus.OK,
      message: 'reminders sent successfully',
    };
  }

  @Get('/active')
  @UseGuards(JwtAuthGuard)
  async findActiveReminders(@getUser() user: User) {
    const reminders = await this.remindersService.getActiveReminder(user);

    return {
      data: reminders,
      statusCode: HttpStatus.OK,
      message: 'reminders sent successfully',
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.remindersService.remove(
      parseInt(id),

      user,
    );

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'reminders deleted successfully',
    };
  }
}
