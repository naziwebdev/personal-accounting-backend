import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: Repository<Reminder>,
  ) {}

  async create(createReminderDto: CreateReminderDto, user: User) {
    const reminder = await this.remindersRepository.create({
      ...createReminderDto,
      user,
      isSent: false,
    });

    return reminder;
  }
}
