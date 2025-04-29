import { Controller } from '@nestjs/common';
import { ReceivablesDebtsService } from './receivables-debts.service';

@Controller('receivables-debts')
export class ReceivablesDebtsController {
  constructor(private readonly receivablesDebtsService: ReceivablesDebtsService) {}
}
