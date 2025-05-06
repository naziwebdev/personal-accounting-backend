import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksController } from './checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Check])],
  controllers: [ChecksController],
  providers: [ChecksService],
  exports: [ChecksService],
})
export class ChecksModule {}
