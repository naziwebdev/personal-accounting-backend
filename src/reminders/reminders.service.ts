import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { LessThan, Repository } from 'typeorm';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { User } from 'src/users/entities/user.entity';
import { ChecksService } from 'src/checks/checks.service';
import { LoansService } from 'src/loans/loans.service';
import { Cron } from '@nestjs/schedule';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // Enables real-time notifications
@Injectable()
export class RemindersService {
  @WebSocketServer()
  server: Server;
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

  async remove(id:number,user:User){
    const reminder = await this.remindersRepository.findOne({
        where:{id,user:{id:user.id}}
    })

    if(!reminder){
        throw new NotFoundException('not found reminder')
    }

    try {
        await this.remindersRepository.remove(reminder)
        
    } catch (error) {
        throw new InternalServerErrorException('delete faild')
    }
  }

  /**
    Send App Notification
   * Emits real-time notifications using WebSockets
   */
  async sendAppNotification(user: User, message: string) {
    if (this.server) {
      this.server.emit(`user_${user.id}_notification`, { message });
      console.log(`Sent notification to user ${user.id}: ${message}`);
    } else {
      console.error(`WebSocket server is not initialized`);
    }
  }

  /**
   * ✅ Schedule and Process Due Reminders
   * Runs every midnight to send notifications for reminders due today
   */
  @Cron('0 0 * * *') // Runs daily at midnight
  async processDueReminders() {
    const today = new Date();

    const reminders = await this.remindersRepository
      .createQueryBuilder('reminder')
      .where(
        `EXISTS (SELECT 1 FROM jsonb_array_elements_text(reminder.dueDates) AS dueDate WHERE dueDate <= :today)`,
        { today: today.toISOString() },
      )
      .andWhere('reminder.isSent = false')
      .leftJoinAndSelect('reminder.user', 'user')
      .getMany();

    for (const reminder of reminders) {
      const message = `Reminder: Your ${reminder.type} is due soon!`;
      this.sendAppNotification(reminder.user, message);

      reminder.isSent = true;
      await this.remindersRepository.save(reminder);
    }
  }
}
