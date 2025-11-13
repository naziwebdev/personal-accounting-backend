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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create note' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'note created successfully',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'notes sent successfully',
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get note by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'note sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found note',
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'update note' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'note updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found note',
  })
  @ApiBody({ type: UpdateNoteDto, required: false })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete note' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'note deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'not found note',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'delete note faild',
  })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@getUser() user: User, @Param('id') id: string) {
    const data = await this.notesService.remove(parseInt(id), user);

    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'note deleted successfully',
    };
  }
}
