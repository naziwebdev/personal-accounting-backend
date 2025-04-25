import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateCardDto {
  @IsString({ message: 'name must be string' })
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(2, { message: 'min chars for name must be 2' })
  @MaxLength(50, { message: 'max chars for name must be 50' })
  bankName: string;

  @IsString({ message: 'bank number must be string' })
  @IsNotEmpty({ message: 'bank number is required' })
  @Matches(/^[0-9]{16}$/, { message: 'card number must be 16 digits' })
  cardNumber: string;

  @IsOptional()
  @IsNumber()
  balance: number;
}
