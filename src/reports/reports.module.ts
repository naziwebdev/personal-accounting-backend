import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { IncomesModule } from 'src/incomes/incomes.module';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [IncomesModule, ExpensesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
