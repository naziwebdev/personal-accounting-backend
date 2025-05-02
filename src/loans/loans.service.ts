import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { UpdateLoanDto } from './dtos/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    @InjectRepository(Installment)
    private installmentsRepository: Repository<Installment>,
  ) {}

  async create(createLoanDto: CreateLoanDto, user: User) {
    const perInstallmentPrice = parseFloat(
      (createLoanDto.totalPrice / createLoanDto.countInstallment).toFixed(2),
    );

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

  async getOne(id: number, user: User) {
    const loan = await this.loansRepository.findOne({
      relations: ['installments'],
      where: { id, user: { id: user.id } },
    });

    if (!loan) {
      throw new NotFoundException('not found loan');
    }

    const remainInstallmentsForPay = await this.installmentsRepository.find({
      where: { loan: { id: loan.id }, status: InstallmentStatusEnum.PENDDING },
    });

    return {
      loan,
      countOfRemainInstallmentsForPay: remainInstallmentsForPay.length,
    };
  }

  async update(updateLoanDto: UpdateLoanDto, id: number, user: User) {
    const loan = await this.loansRepository.findOne({
      relations: ['installments', 'user'],
      where: { id, user: { id: user.id } },
    });

    if (!loan) {
      throw new NotFoundException('not found loan');
    }

    const totalPrice = updateLoanDto.totalPrice ?? loan.totalPrice;
    const countInstallment =
      updateLoanDto.countInstallment ?? loan.countInstallment;
    const firstDateInstallment =
      updateLoanDto.firstDateInstallment ?? loan.firstDateInstallment;
    const periodInstallment =
      updateLoanDto.periodInstallment ?? loan.periodInstallment;

    const perInstallmentPrice = parseFloat(
      (totalPrice / countInstallment).toFixed(2),
    );

    const installmentDates = calculateInstallmentsDates(
      new Date(firstDateInstallment),
      periodInstallment,
      countInstallment,
    );

    Object.assign(loan, updateLoanDto);
    await this.loansRepository.save(loan);

    const updatedInstallments = installmentDates.map((dueDate, index) => ({
      ...loan.installments[index],
      price: perInstallmentPrice,
      dueDate,
      loan,
    }));

    await this.installmentsRepository.save(updatedInstallments);

    return loan;
  }

  async updateInstallmentStatus(
    id: number,
    status: InstallmentStatusEnum,
    user: User,
  ) {
    const installment = await this.installmentsRepository
      .createQueryBuilder('installment')
      .leftJoinAndSelect('installment.loan', 'loan')
      .leftJoinAndSelect('loan.user', 'user')
      .where('installment.id = :id', { id })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!installment) {
      throw new NotFoundException('Installment not found');
    }

    installment.status = status;
    const savedInstallment =
      await this.installmentsRepository.save(installment);

    const loan = await this.loansRepository.findOne({
      where: { id: installment.loan.id },
      relations: ['installments'],
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    const allPaid = loan.installments.every(
      (inst) => inst.status === InstallmentStatusEnum.PAID,
    );

    if (allPaid) {
      loan.status = LoanStatusEnum.PAID;
      await this.loansRepository.save(loan);
    } else {
      loan.status = LoanStatusEnum.PENDDING;
      await this.loansRepository.save(loan);
    }

    return savedInstallment;
  }

  async remove(id: number, user: User) {
    const loan = await this.loansRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!loan) {
      throw new NotFoundException('not found loan');
    }

    const installments = await this.installmentsRepository.find({
      where: { loan: { id: loan.id } },
    });

    if (installments.length === 0) {
      throw new NotFoundException('not found installments');
    }

    try {
      await this.installmentsRepository.remove(installments);
      await this.loansRepository.remove(loan);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete');
    }
  }
}
