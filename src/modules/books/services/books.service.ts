import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookDto } from '../dto/book.dto';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  async create(createBookDto: CreateBookDto) {
    try {
      const book = this.bookRepository.create(createBookDto);
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating book');
    }
  }
}
