import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankCards } from './entities/bank-card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateCardDto } from './dtos/update-card.dto';

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

  async getAll(user: User) {
    const userCards = await this.bankCardsRepository.find({
      where: {
        user: { id: user.id },
      },
      order: {
        id: 'DESC',
      },
    });

    return userCards;
  }

  async getOne(id: number, user: User) {
    const userCard = await this.bankCardsRepository.findOne({
      relations: ['user'],
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!userCard) {
      throw new NotFoundException('not found card');
    }

    return userCard;
  }

  async update(id: number, updateCardDto: UpdateCardDto, user: User) {
    const userCard = await this.bankCardsRepository.findOne({
      relations: ['user'],
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!userCard) {
      throw new NotFoundException('not found card');
    }

    Object.assign(userCard, updateCardDto);

    return await this.bankCardsRepository.save(userCard);
  }

  async remove(id: number, user: User) {
    const userCard = await this.bankCardsRepository.findOne({
      relations: ['user'],
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!userCard) {
      throw new NotFoundException('not found card');
    }

    try {
      await this.bankCardsRepository.remove(userCard);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete');
    }
  }
}
