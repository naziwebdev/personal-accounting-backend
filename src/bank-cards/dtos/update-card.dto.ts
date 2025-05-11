import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength, MaxLength, Matches } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiPropertyOptional({ example: 'saman', description: 'bank name' })
  @IsString({ message: 'name must be string' })
  @MinLength(2, { message: 'min chars for name must be 2' })
  @MaxLength(50, { message: 'max chars for name must be 50' })
  bankName?: string;

  @ApiPropertyOptional({ example: '6219861988765432', description: 'credit-card number' })
  @IsString({ message: 'bank number must be string' })
  @Matches(/^[0-9]{16}$/, { message: 'card number must be 16 digits' })
  cardNumber?: string;

  @ApiPropertyOptional({ example: '1000000', description: 'balance of card' })
  @IsNumber()
  balance?: number;
}
