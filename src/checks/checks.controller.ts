import { Controller } from '@nestjs/common';
import { ChecksService } from './checks.service';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}
}
