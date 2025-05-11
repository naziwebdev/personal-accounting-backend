import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateReminderDto } from './create-reminder.dto';
import { ReminderTypeEnum } from '../enums/reminder-type-enum';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {
  @ApiPropertyOptional({
    example: 'loan',
    description: 'Type of reminder (loan or check)',
    enum: ReminderTypeEnum,
  })
  type?: ReminderTypeEnum;

  @ApiPropertyOptional({
    example: 123,
    description: 'Entity ID associated with the reminder',
  })
  entityId?: number;
}
