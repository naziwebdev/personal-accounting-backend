import { IsEnum, IsNotEmpty } from 'class-validator';
import { InstallmentStatusEnum } from '../enums/loan-status-enum';

export class UpdateStatusInstallment {
  @IsEnum(InstallmentStatusEnum, { message: 'status must me pendding/paid' })
  @IsNotEmpty({ message: 'status is required' })
  status: InstallmentStatusEnum;
}
