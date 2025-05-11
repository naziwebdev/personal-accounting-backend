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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create reminder' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'reminder created successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found entity id',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all reminders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'reminders sent successfully',
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get active reminders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'active reminders sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found active reminder',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found entity id',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete reminder' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'reminder deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found reminder',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'delete reminder faild',
  })
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
