import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from '../dto/genre.dto';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  private readonly logger = new Logger('BooksService');

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  findAll(paginationDto: PaginationDto) {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.bookRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async create(createBookDto: CreateBookDto) {
    try {
      const book = this.bookRepository.create(createBookDto);
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      // console.log(error);
      // throw new InternalServerErrorException('Error creating book');
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`El libro con id ${id} no fue encontrado`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`El libro con id ${id} no fue encontrado`);
    }
    try {
      this.bookRepository.merge(book, updateBookDto);
      await this.bookRepository.save(book);
      return {
        message: `El libro con id ${id} ha sido actualizado`,
        data: book,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exists = await this.bookRepository.existsBy({ id });
    if (!exists) {
      throw new NotFoundException(
        `El libro con id ${id} no pudo ser encontrado`,
      );
    }
    await this.bookRepository.softDelete(id);

    return {
      message: `El libro con id ${id} ha sido eliminado correctamente`,
      deleteAt: new Date(),
    };
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      `Error inesperado, se deben de verificar los registros del servidor`,
    );
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
