import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRoleEnum } from './enums/user-role-enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByPhone(phone: string) {
    const user = await this.usersRepository.findOne({
      where: { phone },
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    return user;
  }

  async create(name: string, phone: string) {
    const usersCount = await this.usersRepository.count();

    const user = await this.usersRepository.create({
      name,
      phone,
      role: usersCount > 0 ? UserRoleEnum.USER : UserRoleEnum.ADMIN,
    });

    return this.usersRepository.save(user);
  }
}
