import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { convertPersianToEnglishDigits } from '../helpers/convert-digits';
import { ApiProperty } from '@nestjs/swagger';

export class SendOTPDto {
  @ApiProperty({ example: '09123456789', description: 'User phone number' })
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be string' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format.',
  })
  @Transform(({ value }) => convertPersianToEnglishDigits(value.trim()))
  phone: string;
}
