import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dtos/create-note.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    const note = await this.notesRepository.create({
      ...createNoteDto,
      user,
    });

    return await this.notesRepository.save(note);
  }

  async findAll(page: number, limit: number, user: User) {
    page = isNaN(Number(page)) ? 1 : Number(page);
    limit = isNaN(Number(limit)) ? 2 : Number(limit);

    const notes = await this.notesRepository.find({
        relations:['user'],
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return notes;
  }

  async findOne(id:number,user:User){
    const note = await this.notesRepository.findOne({
        relations:['user'],
        where:{id,user:{id:user.id}}
    })

    if(!note){
        throw new NotFoundException('not found note')
    }

    return note
  }
}
