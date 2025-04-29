import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ReceivableDebtStatusEnum } from '../enums/receivable-debt-status';

export class UpdateReceivableDebtStatusDto {
  @IsEnum(ReceivableDebtStatusEnum, {
    message: 'status must be pendding or paid',
  })
  @IsNotEmpty({ message: 'status is required' })
  @IsString()
  status: ReceivableDebtStatusEnum;
}
