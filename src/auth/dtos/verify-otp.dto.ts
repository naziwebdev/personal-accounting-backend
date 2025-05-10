import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { convertPersianToEnglishDigits } from '../helpers/convert-digits';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be string' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format.',
  })
  @Transform(({ value }) => convertPersianToEnglishDigits(value.trim()))
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  phone: string;

  @IsNotEmpty({ message: 'otp is required' })
  @IsString({ message: 'otp must be string' })
  @Matches(/^[0-9]{4}$/, {
    message: 'otp must be a valid format.',
  })
  @Length(4, 4, { message: 'otp must have 4 length' })
  otp: string;
}
