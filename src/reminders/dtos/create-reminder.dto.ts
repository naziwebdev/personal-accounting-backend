import { IsDateString, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ReminderTypeEnum } from '../enums/reminder-type-enum';
import { Transform } from 'class-transformer';

export class ReminderDateDto {
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString()) 
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
