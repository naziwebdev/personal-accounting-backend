import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksController } from './checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Check])],
  controllers: [ChecksController],
  providers: [ChecksService],
})
export class ChecksModule {}
