import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { User } from 'src/users/entities/user.entity';
import { BankCardsService } from 'src/bank-cards/bank-cards.service';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
  ) {}

  async create(createIncomeDto: CreateIncomeDto, user: User) {
    const income = await this.incomesRepository.create({
      title: createIncomeDto.title,
      price: createIncomeDto.price,
      date: createIncomeDto.date,
      description: createIncomeDto.description,
      user,
      category: { id: createIncomeDto.category_id },
      bankCard: { id: createIncomeDto.bankCard_id },
    });

    return await this.incomesRepository.save(income);
  }

  async findAll(page: number = 1, limit: number = 2, user: User) {
    const userIncomes = await this.incomesRepository.find({
      relations: ['user', 'category', 'bankCard'],
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return userIncomes;
  }

  async findOne(id: number, user: User) {
    const income = await this.incomesRepository.findOne({
      relations: ['user', 'category', 'bankCard'],
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (income?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }

    return income;
  }
}
