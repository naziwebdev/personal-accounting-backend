import {
  Body,
  Controller,
  HttpStatus,
  Post,
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
}
