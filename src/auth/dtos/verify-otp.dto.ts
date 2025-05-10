import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { convertPersianToEnglishDigits } from '../helpers/convert-digits';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be string' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format.',
  })
  @ApiProperty({ example: '09123456789', description: 'User phone number' })
  @Transform(({ value }) => convertPersianToEnglishDigits(value.trim()))
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  phone: string;

  @ApiProperty({ example: '6789', description: 'otp' })
  @IsNotEmpty({ message: 'otp is required' })
  @IsString({ message: 'otp must be string' })
  @Matches(/^[0-9]{4}$/, {
    message: 'otp must be a valid format.',
  })
  @Length(4, 4, { message: 'otp must have 4 length' })
  otp: string;
}
