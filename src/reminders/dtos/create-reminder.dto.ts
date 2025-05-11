import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ReminderTypeEnum } from '../enums/reminder-type-enum';

export class CreateReminderDto {
  @ApiProperty({ example: 'loan', description: 'Type of reminder (loan or check)', enum: ReminderTypeEnum })
  @IsEnum(ReminderTypeEnum, { message: 'type must be loan or check' })
  @IsNotEmpty({ message: 'type is required' })
  type: ReminderTypeEnum;

  @ApiProperty({ example: 123, description: 'Entity ID associated with the reminder' })
  @IsInt()
  @IsNotEmpty({ message: 'entity id is required' })
  entityId: number;
}
