import { Module } from '@nestjs/common';
import { ReceivablesDebtsService } from './receivables-debts.service';
import { ReceivablesDebtsController } from './receivables-debts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivableDebt } from './entities/receivable-debt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReceivableDebt])],
  controllers: [ReceivablesDebtsController],
  providers: [ReceivablesDebtsService],
})
export class ReceivablesDebtsModule {}
