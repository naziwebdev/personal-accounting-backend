import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { ChecksModule } from 'src/checks/checks.module';
import { LoansModule } from 'src/loans/loans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder]), ChecksModule, LoansModule],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
