import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { LessThan, Repository } from 'typeorm';
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
      order: { createdAt: 'DESC' },
    });

    return reminders;
  }

  async remove(id: number, user: User) {
    const reminder = await this.remindersRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!reminder) {
      throw new NotFoundException('not found reminder');
    }

    try {
      await this.remindersRepository.remove(reminder);
    } catch (error) {
      throw new InternalServerErrorException('delete faild');
    }
  }

  async getActiveReminder(user: User) {
    const today = new Date().toISOString().split('T')[0];

    const reminders = await this.remindersRepository
      .createQueryBuilder('reminder')
      .where(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(reminder.dueDates) AS dueDate 
          WHERE LEFT(dueDate, 10) = :today
        )`,
        { today },
      )
      .andWhere('reminder.isSent = false')
      .andWhere('reminder.userId = :userId', { userId: user.id })
      .getMany();
    if (reminders.length === 0) {
      throw new NotFoundException('not found active reminder today');
    }

    for (let reminder of reminders) {
      if (reminder.type === 'loan') {
        (reminder as any).entity = (
          await this.loanService.getOne(reminder.entityId, user)
        ).loan;
      } else if (reminder.type === 'check') {
        (reminder as any).entity = await this.checksService.getById(
          reminder.entityId,
          user,
        );
      } else {
        throw new NotFoundException('entity id is not found');
      }
    }

    return reminders;
  }
}
