import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { BankCardsModule } from 'src/bank-cards/bank-cards.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Income]),BankCardsModule,CategoriesModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [TypeOrmModule],
  
})
export class IncomesModule {}
