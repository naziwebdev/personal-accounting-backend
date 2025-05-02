import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Repository } from 'typeorm';
import { Installment } from './entities/installment.entity';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { User } from 'src/users/entities/user.entity';
import { calculateInstallmentsDates } from './helpers/calculate-installments-dates';
import {
  InstallmentStatusEnum,
  LoanStatusEnum,
} from './enums/loan-status-enum';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    @InjectRepository(Installment)
    private installmentsRepository: Repository<Installment>,
  ) {}

  async create(createLoanDto: CreateLoanDto, user: User) {
    const perInstallmentPrice =
      createLoanDto.totalPrice / createLoanDto.countInstallment;

    const installmentDates = calculateInstallmentsDates(
      new Date(createLoanDto.firstDateInstallment),
      createLoanDto.periodInstallment,
      createLoanDto.countInstallment,
    );

    const loan = await this.loansRepository.create({
      ...createLoanDto,
      user,
      status: LoanStatusEnum.PENDDING,
    });

    const savedLoan = await this.loansRepository.save(loan);

    const installments = installmentDates.map((dueDate) =>
      this.installmentsRepository.create({
        loan,
        price: perInstallmentPrice,
        dueDate,
        status: InstallmentStatusEnum.PENDDING,
      }),
    );

    await this.installmentsRepository.save(installments);

    return loan;
  }
}
