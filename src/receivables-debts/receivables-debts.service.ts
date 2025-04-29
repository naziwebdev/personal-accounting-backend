import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceivableDebt } from './entities/receivable-debt.entity';
import { Repository } from 'typeorm';
import { CreateReceivableDebtDto } from './dtos/create-receivable-debt.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReceivablesDebtsService {
  constructor(
    @InjectRepository(ReceivableDebt)
    private receivablesDebtsRepository: Repository<ReceivableDebt>,
  ) {}

  async create(createReceivableDebtDto: CreateReceivableDebtDto, user: User) {
    const receivableOrDebt = await this.receivablesDebtsRepository.create({
      ...createReceivableDebtDto,
      user,
    });

    return await this.receivablesDebtsRepository.save(receivableOrDebt);
  }
}
