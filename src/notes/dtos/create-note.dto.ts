import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Meeting Notes', description: 'Title of the note (length between 3-150)' })
  @IsString({ message: 'title must be string' })
  @IsNotEmpty({ message: 'title is required' })
  @Length(3, 150, { message: 'title must have 3-150 length' })
  title: string;

  @ApiProperty({ example: 'Detailed notes from the project meeting', description: 'Description of the note (length between 3-2500)' })
  @IsString({ message: 'description must be string' })
  @IsNotEmpty({ message: 'description is required' })
  @Length(3, 2500, { message: 'description must have 3-2500 length' })
  description: string;
}
