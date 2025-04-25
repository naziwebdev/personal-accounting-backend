import { Controller } from '@nestjs/common';
import { BankCardsService } from './bank-cards.service';

@Controller('bank-cards')
export class BankCardsController {
  constructor(private readonly bankCardsService: BankCardsService) {}
}
