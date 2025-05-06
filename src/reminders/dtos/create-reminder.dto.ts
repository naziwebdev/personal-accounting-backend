import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ReminderTypeEnum } from '../enums/reminder-type-enum';

export class ReminderDateDto {
  @IsDateString() // Validate each as ISO8601 date
  dueDate: string;
}

export class CreateReminderDto {
  @IsEnum(ReminderTypeEnum, {
    message: 'type must be loan or check',
  })
  @IsNotEmpty({ message: 'type is required' })
  type: ReminderTypeEnum;

  @IsInt()
  @IsNotEmpty({ message: 'entity id is required' })
  entityId: number;
}
