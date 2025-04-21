import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
}
