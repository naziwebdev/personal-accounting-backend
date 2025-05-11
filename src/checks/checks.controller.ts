import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dtos/create-check.dto';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CheckTypeEnum } from './enums/check-type-enum';
import { CheckStatusEnum } from './enums/check-status-enum';
import { UpdateCheckDto } from './dtos/update-check.dto';
import { UpdateStatusCheckDto } from './dtos/update-status-check.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create check' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'check created successfully',
  })
  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateCheckDto) {
    const check = await this.checksService.create(body, user);

    return {
      data: check,
      statusCode: HttpStatus.CREATED,
      message: 'check created successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all checks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'checks sent successfully',
  })
  @ApiQuery({ name: 'page', type: Number, description: 'page', required: true })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'limit items',
    required: true,
  })
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const checks = await this.checksService.getAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: checks,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get checks by type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'checks sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'checks not found',
  })
  @ApiQuery({
    name: 'type',
    enum: CheckTypeEnum,
    description: 'type of check',
    required: true,
  })
  @Get('/type')
  @UseGuards(JwtAuthGuard)
  async findByType(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type: CheckTypeEnum,
  ) {
    const checks = await this.checksService.getByType(
      parseInt(page),
      parseInt(limit),
      type,
      user,
    );

    return {
      data: checks,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get checks by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'checks sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'check not found',
  })
  @ApiQuery({
    name: 'status',
    enum: CheckStatusEnum,
    description: 'status of check',
    required: true,
  })
  @Get('/status')
  @UseGuards(JwtAuthGuard)
  async findByStatus(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: CheckStatusEnum,
  ) {
    const checks = await this.checksService.getByStatus(
      parseInt(page),
      parseInt(limit),
      status,
      user,
    );

    return {
      data: checks,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get check by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'check sent successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@getUser() user: User, @Param('id') id: string) {
    const check = await this.checksService.getById(parseInt(id), user);

    return {
      data: check,
      statusCode: HttpStatus.OK,
      message: 'checks sent successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'check updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @ApiBody({ type: UpdateCheckDto, required: false })
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateCheckDto,
  ) {
    const check = await this.checksService.update(body, parseInt(id), user);

    return {
      data: check,
      statusCode: HttpStatus.OK,
      message: 'checks updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update status check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'status check updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateStatusCheckDto,
  ) {
    const check = await this.checksService.updateStatus(
      body,
      parseInt(id),
      user,
    );

    return {
      data: check,
      statusCode: HttpStatus.OK,
      message: 'checks status updated successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'check deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'check not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'check delete faild',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.checksService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'checks deleted successfully',
    };
  }
}
