import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGenreDto } from '../dto/genre.dto';
import { Repository } from 'typeorm';
import { Genre} from '../entities/genre.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly GenreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) { 
    try {
      const genre = this.GenreRepository.create(createGenreDto);
        await this.GenreRepository.save(genre);
        return genre;
    } catch (error) {   
        console.error('Error :', error);
        throw new InternalServerErrorException('Ayuda');
        }
    }
}
