import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { convertPersianToEnglishDigits } from '../helpers/convert-digits';

export class SendOTPDto {
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be string' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format.',
  })
  @Transform(({ value }) => convertPersianToEnglishDigits(value.trim()))
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  phone: string;
}
