import { Injectable } from '@nestjs/common';
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
}
