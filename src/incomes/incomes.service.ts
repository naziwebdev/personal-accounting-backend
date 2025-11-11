import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dtos/create-income.dto';
import { User } from 'src/users/entities/user.entity';
import { BankCardsService } from 'src/bank-cards/bank-cards.service';
import { UpdateIncomeDto } from './dtos/update-income.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryTypeEnum } from 'src/categories/enums/category-type-enum';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
    private bankCardService: BankCardsService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createIncomeDto: CreateIncomeDto, user: User) {
    if (createIncomeDto.bankCard_id) {
      const card = await this.bankCardService.getOne(
        createIncomeDto.bankCard_id,
        user,
      );
      if (!card) {
        throw new NotFoundException('not found bank-card');
      }
    }

    if (createIncomeDto.category_id) {
      const category = await this.categoriesService.findById(
        createIncomeDto.category_id,
        CategoryTypeEnum.INCOME,
      );

      if (!category) {
        throw new NotFoundException('not found category');
      }
    }
    const income = await this.incomesRepository.create({
      title: createIncomeDto.title,
      price: createIncomeDto.price,
      date: createIncomeDto.date,
      description: createIncomeDto.description,
      user,
      category: { id: createIncomeDto.category_id },
      bankCard: { id: createIncomeDto.bankCard_id },
    });

    const savedIncome = await this.incomesRepository.save(income);

    const totalCount = await this.incomesRepository.count({
      where: { user: { id: user.id } },
    });

    return {
      income: savedIncome,
      totalCount,
    };
  }

  async findAll(page: number = 1, limit: number = 2, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const totalCount = await this.incomesRepository.count({
      where: { user: { id: user.id } },
    });

    const userIncomes = await this.incomesRepository.find({
      relations: ['user', 'category', 'bankCard'],
      where: { user: { id: user.id } },
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: userIncomes,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number, user: User) {
    const income = await this.incomesRepository.findOne({
      relations: ['user', 'category', 'bankCard'],
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!income) {
      throw new NotFoundException('not found income');
    }

    if (income?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }

    return income;
  }

  async update(updateIncomeDto: UpdateIncomeDto, id: number, user: User) {
    if (updateIncomeDto.bankCard_id) {
      const card = await this.bankCardService.getOne(
        updateIncomeDto.bankCard_id,
        user,
      );
      if (!card) {
        throw new NotFoundException('not found bank-card');
      }
    }

    if (updateIncomeDto.category_id) {
      const category = await this.categoriesService.findById(
        updateIncomeDto.category_id,
        CategoryTypeEnum.INCOME,
      );

      if (!category) {
        throw new NotFoundException('not found category');
      }
    }

    const income = await this.incomesRepository.findOne({
      relations: ['user', 'category', 'bankCard'],
      where: { id, user: { id: user.id } },
    });

    if (!income) {
      throw new NotFoundException('not found income');
    }

    if (income?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }
    income.title = updateIncomeDto.title ?? income.title;
    income.price = updateIncomeDto.price ?? income.price;
    income.date = updateIncomeDto.date ?? (income.date as any);
    income.description = updateIncomeDto.description ?? income.description;
    income.category.id = updateIncomeDto.category_id ?? income.category.id;
    income.bankCard.id = updateIncomeDto.bankCard_id ?? income.bankCard.id;

    return await this.incomesRepository.save(income);
  }

  async remove(id: number, user: User) {
    const income = await this.incomesRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!income) {
      throw new NotFoundException('not found income');
    }

    if (income?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }

    try {
      await this.incomesRepository.remove(income);

      const totalCount = await this.incomesRepository.count({
        where: { user: { id: user.id } },
      });

      return { success: true, totalCount };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete');
    }
  }
}
