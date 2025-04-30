import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Expense } from './entities/expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankCardsService } from 'src/bank-cards/bank-cards.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { User } from 'src/users/entities/user.entity';
import { CategoryTypeEnum } from 'src/categories/enums/category-type-enum';
import { Income } from 'src/incomes/entities/income.entity';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private bankCardService: BankCardsService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    if (createExpenseDto.bankCard_id) {
      const card = await this.bankCardService.getOne(
        createExpenseDto.bankCard_id,
        user,
      );
      if (!card) {
        throw new NotFoundException('not found bank-card');
      }
    }

    if (createExpenseDto.category_id) {
      const category = await this.categoriesService.findById(
        createExpenseDto.category_id,
        CategoryTypeEnum.EXPENSE,
      );

      if (!category) {
        throw new NotFoundException('not found category');
      }
    }
    const expense = await this.expenseRepository.create({
      title: createExpenseDto.title,
      price: createExpenseDto.price,
      date: createExpenseDto.date,
      description: createExpenseDto.description,
      user,
      category: { id: createExpenseDto.category_id },
      bankCard: { id: createExpenseDto.bankCard_id },
    });

    return await this.expenseRepository.save(expense);
  }

  async findAll(page: number = 1, limit: number = 2, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);
    const userExpenses = await this.expenseRepository.find({
      relations: ['user', 'category', 'bankCard'],
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return userExpenses;
  }

  async findOne(id: number, user: User) {
    const expense = await this.expenseRepository.findOne({
      relations: ['user', 'category', 'bankCard'],
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!expense) {
      throw new NotFoundException('not found expense');
    }

    if (expense?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }

    return expense;
  }

  async update(updatExpenseDto: UpdateExpenseDto, id: number, user: User) {
    if (updatExpenseDto.bankCard_id) {
      const card = await this.bankCardService.getOne(
        updatExpenseDto.bankCard_id,
        user,
      );
      if (!card) {
        throw new NotFoundException('not found bank-card');
      }
    }

    if (updatExpenseDto.category_id) {
      const category = await this.categoriesService.findById(
        updatExpenseDto.category_id,
        CategoryTypeEnum.EXPENSE,
      );

      if (!category) {
        throw new NotFoundException('not found category');
      }
    }

    const expense = await this.expenseRepository.findOne({
      relations: ['user', 'category', 'bankCard'],
      where: { id, user: { id: user.id } },
    });

    if (!expense) {
      throw new NotFoundException('not found expense');
    }

    if (expense?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }
    expense.title = updatExpenseDto.title ?? expense.title;
    expense.price = updatExpenseDto.price ?? expense.price;
    expense.date = updatExpenseDto.date ?? (expense.date as any);
    expense.description = updatExpenseDto.description ?? expense.description;
    expense.category.id = updatExpenseDto.category_id ?? expense.category.id;
    expense.bankCard.id = updatExpenseDto.bankCard_id ?? expense.bankCard.id;

    return await this.expenseRepository.save(expense);
  }

  async remove(id: number, user: User) {
    const expense = await this.expenseRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!expense) {
      throw new NotFoundException('not found expense');
    }

    if (expense?.user.id !== user.id) {
      throw new UnauthorizedException('forbidden route');
    }

  
    try {
      await this.expenseRepository.remove(expense);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete');
    }
  }
}
