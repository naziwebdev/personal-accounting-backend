import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { Repository } from 'typeorm';
import { CreateCheckDto } from './dtos/create-check.dto';
import { User } from 'src/users/entities/user.entity';

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
}
