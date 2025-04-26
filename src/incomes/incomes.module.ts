import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { BankCardsModule } from 'src/bank-cards/bank-cards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Income]),BankCardsModule],
  controllers: [IncomesController],
  providers: [IncomesService],
  
})
export class IncomesModule {}
