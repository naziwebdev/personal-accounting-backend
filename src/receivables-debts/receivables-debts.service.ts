import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceivableDebt } from './entities/receivable-debt.entity';
import { Repository } from 'typeorm';
import { CreateReceivableDebtDto } from './dtos/create-receivable-debt.dto';
import { User } from 'src/users/entities/user.entity';
import { ReceivableDebtTypeEnum } from './enums/receivable-debt-type-enum';

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

  async getByType(user: User, type: ReceivableDebtTypeEnum) {
    const receivablesOrDebts = await this.receivablesDebtsRepository.find({
      where: { type, user: { id: user.id } },
    });

    return receivablesOrDebts;
  }

  async getById(id: number, user: User) {
    const receivableOrDebt = await this.receivablesDebtsRepository.findOne({
        relations:['user'],
      where: { id, user: { id: user.id } },
    });

    if (!receivableOrDebt) {
      throw new NotFoundException('not found receivableOrDebt');
    }

    return receivableOrDebt;
  }
}
