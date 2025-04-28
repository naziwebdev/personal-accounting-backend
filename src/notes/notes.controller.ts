import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { getUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateNoteDto } from './dtos/create-note.dto';
import { Response } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @getUser() user: User,
    @Body() body: CreateNoteDto,
    @Res() res: Response,
  ) {
    const note = await this.notesService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: note,
      statusCode: HttpStatus.CREATED,
      message: 'note created successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @getUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Res() res: Response,
  ) {
    const notes = await this.notesService.findAll(
      parseInt(page),
      parseInt(limit),
      user,
    );

    return res.status(HttpStatus.OK).json({
      data: notes,
      statusCode: HttpStatus.OK,
      message: 'notes sent successfully',
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @getUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const note = await this.notesService.findOne(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: note,
      statusCode: HttpStatus.OK,
      message: 'note sent successfully',
    });
  }
}
