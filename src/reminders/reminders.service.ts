import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { User } from 'src/users/entities/user.entity';
import { ChecksService } from 'src/checks/checks.service';
import { LoansService } from 'src/loans/loans.service';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: Repository<Reminder>,
    private checksService: ChecksService,
    private loanService: LoansService,
  ) {}

  async create(createReminderDto: CreateReminderDto, user: User) {
    let entity = null;
    let entityDueDates = [];
    let dueDates = [];
    if (createReminderDto.type === 'loan') {
      entity = (await this.loanService.getOne(createReminderDto.entityId, user))
        .loan;

      for (let installment of entity.installments) {
        entityDueDates.push(installment.dueDate);
      }
    } else if (createReminderDto.type === 'check') {
      entity = await this.checksService.getById(
        createReminderDto.entityId,
        user,
      );

      entityDueDates.push(entity.due_date);
    } else {
      throw new NotFoundException('entity id is not found');
    }
    for (let dueDate of entityDueDates) {
      // Calculate 7 days before
      const sevenDaysBefore = new Date(dueDate);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

      // Calculate 1 day before
      const oneDayBefore = new Date(dueDate);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);

      dueDates.push(sevenDaysBefore, oneDayBefore);
    }

    const reminder = await this.remindersRepository.create({
      type: createReminderDto.type,
      user,
      isSent: false,
      dueDates,
      entityId: entity.id,
    });

    return await this.remindersRepository.save(reminder);
  }

  async getAll(page: number, limit: number, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const reminders = await this.remindersRepository.find({
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return reminders;
  }
}
