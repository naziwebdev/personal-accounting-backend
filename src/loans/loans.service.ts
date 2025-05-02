import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { In, Repository } from 'typeorm';
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

    return savedLoan;
  }

  async getAll(page: number, limit: number, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const loans = await this.loansRepository.find({
      relations: ['installments'],
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return loans;
  }

  async getByStatus(
    page: number,
    limit: number,
    status: LoanStatusEnum,
    user: User,
  ) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const loans = await this.loansRepository.find({
      relations: ['installments'],
      where: { user: { id: user.id }, status },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    if (loans.length === 0) {
      throw new NotFoundException('not found loan with this status');
    }

    return loans;
  }
}
