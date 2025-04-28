import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { BankCardsModule } from 'src/bank-cards/bank-cards.module';

@Module({
  imports:[TypeOrmModule.forFeature([Expense]),CategoriesModule,BankCardsModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
