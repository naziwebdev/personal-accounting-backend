import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dtos/create-check.dto';
import { User } from 'src/users/entities/user.entity';
import { CheckTypeEnum } from './enums/check-type-enum';
import { CheckStatusEnum } from './enums/check-status-enum';

@Injectable()
export class ChecksService {
  constructor(
    @InjectRepository(Check)
    private checksRepository: Repository<Check>,
  ) {}

  async create(createCheckDto: CreateCheckDto, user: User) {
    const check = await this.checksRepository.create({
      ...createCheckDto,
      user,
    });

    return await this.checksRepository.save(check);
  }

  async getAll(page: number, limit: number, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);
    const checks = await this.checksRepository.find({
      relations: ['user'],
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return checks;
  }

  async getByType(
    page: number,
    limit: number,
    type: CheckTypeEnum,
    user: User,
  ) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);
    const checks = await this.checksRepository.find({
      relations: ['user'],
      where: { type, user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (checks.length === 0) {
      throw new NotFoundException('not found check with this type');
    }

    return checks;
  }

  async getByStatus(
    page: number,
    limit: number,
    status: CheckStatusEnum,
    user: User,
  ) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);
    const checks = await this.checksRepository.find({
      relations: ['user'],
      where: { status, user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (checks.length === 0) {
      throw new NotFoundException('not found check with this status');
    }

    return checks;
  }

  async getById(id: number, user: User) {
    const check = await this.checksRepository.findOne({
      relations: ['user'],
      where: { id, user: { id: user.id } },
    });

    if (!check) {
      throw new NotFoundException('not found check');
    }

    return check;
  }
}
