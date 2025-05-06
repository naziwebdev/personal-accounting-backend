import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Installment } from './entities/installment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Installment])],
  controllers: [LoansController],
  providers: [LoansService],
  exports:[LoansService]
})
export class LoansModule {}
