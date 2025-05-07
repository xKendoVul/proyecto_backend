import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto, UpdateBookDto, FilterBookDto } from '../dto/book.dto';
import { Genre } from '../entities/genre.entity';
import { Book } from '../entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  private readonly logger = new Logger('BooksService');

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}
  FindAll(params?: FilterBookDto) {
    const { limit, offset, description } = params || {};
    const where: FindOptionsWhere<Book> = {};

    if (description) {
      where.description = ILike(`%${description}%`);
    }
    return this.bookRepository.find({
      order: { id: 'ASC' },
      where,
      take: limit,
      skip: offset,
      relations: {
        genre: true,
      },
    });
  }
  async create(createBookDto: CreateBookDto) {
    try {
      const book = this.bookRepository.create(createBookDto);
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      this.handleDBException(error);
    }
  }
}