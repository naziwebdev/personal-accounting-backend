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


  async create(createCheckDto:CreateCheckDto,user:User){
    const check = await this.checksRepository.create({
        ...createCheckDto,
        user
    })

    return await this.checksRepository.save(check)
  }

  
}
