import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CheckStatusEnum } from '../enums/check-status-enum';

export class UpdateStatusCheckDto {
  @ApiProperty({
    example: 'pending',
    description: 'Check status (pending/paid/returned)',
    enum: CheckStatusEnum,
  })
  @IsEnum(CheckStatusEnum, { message: 'status must be pending/paid/returned' })
  @IsNotEmpty({ message: 'status is required' })
  @IsString()
  status: CheckStatusEnum;
}
