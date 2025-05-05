import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommonCRUDService } from 'src/common/services/commonCRUD.service';
// import { CreateGenreDto } from '../dto/genre.dto';
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

export class GenreService extends CommonCRUDService<Genre> {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {
    super(genreRepository);
  }
}
