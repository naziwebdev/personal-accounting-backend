import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { InstallmentStatusEnum } from '../enums/loan-status-enum';

export class UpdateStatusInstallment {
  @ApiProperty({ example: 'pending', description: 'Installment status (pending/paid)', enum: InstallmentStatusEnum })
  @IsEnum(InstallmentStatusEnum, { message: 'status must be pending/paid' })
  @IsNotEmpty({ message: 'status is required' })
  status: InstallmentStatusEnum;
}
