import { Module } from '@nestjs/common';
import { BankCardsService } from './bank-cards.service';
import { BankCardsController } from './bank-cards.controller';
import { BankCards } from './entities/bank-card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BankCards])],
  controllers: [BankCardsController],
  providers: [BankCardsService],
  exports:[BankCardsService]
})
export class BankCardsModule {}
