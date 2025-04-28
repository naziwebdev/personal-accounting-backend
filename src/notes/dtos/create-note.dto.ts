import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'title must be string' })
  @IsNotEmpty({ message: 'title is required' })
  @Length(3, 150, { message: 'title must have 3-150 length' })
  title: string;

  @IsString({ message: 'description must be string' })
  @IsNotEmpty({ message: 'description is required' })
  @Length(3, 2500, { message: 'description must have 3-150 length' })
  description: string;
}
