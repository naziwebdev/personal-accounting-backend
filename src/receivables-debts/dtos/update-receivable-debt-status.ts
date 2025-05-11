import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReceivableDebtStatusEnum } from '../enums/receivable-debt-status';

export class UpdateReceivableDebtStatusDto {
  @ApiProperty({
    example: 'pending',
    description: 'Receivable debt status (pending or paid)',
    enum: ReceivableDebtStatusEnum,
  })
  @IsEnum(ReceivableDebtStatusEnum, {
    message: 'status must be pending or paid',
  })
  @IsNotEmpty({ message: 'status is required' })
  @IsString()
  status: ReceivableDebtStatusEnum;
}
