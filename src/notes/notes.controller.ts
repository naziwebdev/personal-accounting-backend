import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@getUser() user: User, @Body() body: CreateNoteDto) {
    const note = await this.notesService.create(body, user);

    return {
      data: note,
      statusCode: HttpStatus.CREATED,
      message: 'note created successfully',
    };
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const notes = await this.notesService.findAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return {
      data: notes,
      statusCode: HttpStatus.OK,
      message: 'notes sent successfully',
    };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@getUser() user: User, @Param('id') id: string) {
    const note = await this.notesService.findOne(parseInt(id), user);

    return {
      data: note,
      statusCode: HttpStatus.OK,
      message: 'note sent successfully',
    };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateNoteDto,
  ) {
    const note = await this.notesService.update(body, parseInt(id), user);

    return {
      data: note,
      statusCode: HttpStatus.OK,
      message: 'note updated successfully',
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    await this.notesService.remove(parseInt(id), user);

    return {
      data: '',
      statusCode: HttpStatus.OK,
      message: 'note deleted successfully',
    };
  }
}
