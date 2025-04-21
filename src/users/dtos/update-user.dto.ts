import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'name must be string' })
  @IsOptional()
  @Length(3, 50, {
    message: 'name must be between 3 and 50 characters',
  })
  name: string;
}
