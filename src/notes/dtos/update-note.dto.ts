import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiPropertyOptional({ example: 'Updated Meeting Notes', description: 'Title of the note (length between 3-150)' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated details from the project meeting', description: 'Description of the note (length between 3-2500)' })
  description?: string;
}
