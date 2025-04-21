import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class registerDto {
  @IsNotEmpty({ message: 'phone is required' })
  @IsString({ message: 'phone must be string' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone number must be a valid format.',
  })
  @Transform(({ value }) => value.trim())
  phone: string;
}
