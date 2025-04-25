import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankCards } from './entities/bank-card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BankCardsService {
  constructor(
    @InjectRepository(BankCards)
    private bankCardsRepository: Repository<BankCards>,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    const bankCard = await this.bankCardsRepository.create({
      ...createCardDto,
      user,
    });

    return await this.bankCardsRepository.save(bankCard);
  }
}
