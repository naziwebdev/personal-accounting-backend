import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReminderTypeEnum } from '../enums/reminder-type-enum';

export class CreateReminderDto {
  @IsEnum(ReminderTypeEnum, {
    message: 'type must be loan or check or debt/receivable',
  })
  @IsNotEmpty({ message: 'type is required' })
  type: ReminderTypeEnum;

  @IsDateString()
  @IsNotEmpty({ message: 'due date is required' })
  dueDate: string;

  @IsInt()
  @IsNotEmpty({ message: 'entity id is required' })
  entityId: number;
}
