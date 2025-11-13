import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceivableDebt } from './entities/receivable-debt.entity';
import { Repository } from 'typeorm';
import { CreateReceivableDebtDto } from './dtos/create-receivable-debt.dto';
import { User } from 'src/users/entities/user.entity';
import { ReceivableDebtTypeEnum } from './enums/receivable-debt-type-enum';
import { UpdateReceivableDebtStatusDto } from './dtos/update-receivable-debt-status';
import { ReceivableDebtStatusEnum } from './enums/receivable-debt-status';
import { UpdateReceivableDebtDto } from './dtos/update-receivable-debt.dto';

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

    const savedItem =
      await this.receivablesDebtsRepository.save(receivableOrDebt);

    const totalCount = await this.receivablesDebtsRepository.count({
      where: { user: { id: user.id }, type: createReceivableDebtDto.type },
    });

    return {
      income: savedItem,
      totalCount,
    };
  }

  async getByType(
    page: number,
    limit: number,
    user: User,
    type: ReceivableDebtTypeEnum,
  ) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const totalCount = await this.receivablesDebtsRepository.count({
      where: { user: { id: user.id }  , type},
    });

    const receivablesOrDebts = await this.receivablesDebtsRepository.find({
      where: { type, user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: receivablesOrDebts,
      totalCount,
      page,
      limit,
    };
  }

  async getById(id: number, user: User) {
    const receivableOrDebt = await this.receivablesDebtsRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!receivableOrDebt) {
      throw new NotFoundException('not found receivableOrDebt');
    }

    return receivableOrDebt;
  }

  async updateStatus(
    receivableDebtStatusDto: UpdateReceivableDebtStatusDto,
    id: number,
    user: User,
  ) {
    const receivableOrDebt = await this.receivablesDebtsRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!receivableOrDebt) {
      throw new NotFoundException('not found receivableOrDebt');
    }

    receivableOrDebt.status = receivableDebtStatusDto.status;

    return await this.receivablesDebtsRepository.save(receivableOrDebt);
  }

  async update(
    updateReceivableDebtDto: UpdateReceivableDebtDto,
    id: number,
    user: User,
  ) {
    const receivableOrDebt = await this.receivablesDebtsRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!receivableOrDebt) {
      throw new NotFoundException('not found receivableOrDebt');
    }

    Object.assign(receivableOrDebt, updateReceivableDebtDto);

    return await this.receivablesDebtsRepository.save(receivableOrDebt);
  }

  async getByStatus(
    page: number,
    limit: number,
    status: ReceivableDebtStatusEnum,
    type: ReceivableDebtTypeEnum,
    user: User,
  ) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const totalCount = await this.receivablesDebtsRepository.count({
      where: { user: { id: user.id } , type },
    });

    const receivablesOrDebts = await this.receivablesDebtsRepository.find({
      where: {
        status,
        type,
        user: { id: user.id },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!receivablesOrDebts) {
      throw new NotFoundException(
        'not found receivablesOrDebts with this status',
      );
    }

    return {
      items: receivablesOrDebts,
      totalCount,
      page,
      limit,
    };
  }

  async remove(id: number, user: User) {
    const receivableOrDebt = await this.receivablesDebtsRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!receivableOrDebt) {
      throw new NotFoundException('not found receivableOrDebt');
    }

    if (receivableOrDebt?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }

    try {
      await this.receivablesDebtsRepository.remove(receivableOrDebt);
      const totalCount = await this.receivablesDebtsRepository.count({
        where: { user: { id: user.id }, type: receivableOrDebt.type },
      });

      return { success: true, totalCount };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete');
    }
  }
}
