import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommonCRUDService } from 'src/common/services/commonCRUD.service';
import { CreateGenreDto } from '../dto/genre.dto';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import { Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService extends CommonCRUDService<
  Book,
  CreateBookDto,
  UpdateBookDto
> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {
    super(bookRepository);
  }
}
// -------------------------------------------------------------- //

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
