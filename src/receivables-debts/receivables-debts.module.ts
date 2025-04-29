import { Module } from '@nestjs/common';
import { ReceivablesDebtsService } from './receivables-debts.service';
import { ReceivablesDebtsController } from './receivables-debts.controller';

@Module({
  controllers: [ReceivablesDebtsController],
  providers: [ReceivablesDebtsService],
})
export class ReceivablesDebtsModule {}
