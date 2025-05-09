import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// import { CreateGenreDto } from '../dto/genre.dto';
import { CreateBookDto, UpdateBookDto, FilterBookDto } from '../dto/book.dto';
import { FindOptionsWhere, Repository, ILike } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  private readonly logger = new Logger('BooksService');

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(
        `El libro con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return book;
  }

  findAll(params?: FilterBookDto) {
    const { limit, offset, title } = params || {};
    const where: FindOptionsWhere<Book> = {};

    if (title) {
      where.title = ILike(`%${title}%`);
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

  async update(id: number, changes: UpdateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`El libro con id ${id} no fue encontrado`);
    }

    if (changes.genre_id) {
      const genre = await this.genreRepository.findOneBy({
        id: Array.isArray(changes.genre_id)
          ? changes.genre_id[0]
          : changes.genre_id,
      });
      if (!genre) {
        throw new NotFoundException(
          `El genero con id ${Array.isArray(changes.genre_id) ? changes.genre_id.join(', ') : changes.genre_id} no fue encontrado`,
        );
      }
      book.genre = [genre];
    }

    this.bookRepository.merge(book, changes);
    const updated = await this.bookRepository.save(book);

    return {
      message: 'Libro actualizado',
      data: updated,
    };
  }

  async remove(id: number) {
    const exist = await this.bookRepository.existsBy({ id });
    if (!exist) {
      throw new NotFoundException(`El libro con id ${id} no fue encontrado`);
    }
    await this.bookRepository.softDelete(id);
    return {
      message: `El libro con id ${id} fue eliminado`,
      deletedAt: new Date(),
    };
  }
  async deleteAllBooks() {
    const query = this.bookRepository.createQueryBuilder('book');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
