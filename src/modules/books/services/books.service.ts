import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import { Repository, In } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Publisher } from '../entities/publisher.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
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

  async findAll(pagination: PaginationDto) {
    const [data, total] = await this.bookRepository.findAndCount({
      take: pagination.limit,
      skip: pagination.offset,
      order: { id: 'ASC' },
      relations: { genre: true, author: true, publisher: true },
    });
    return { data, total };
  }
  // findAll(params?: FilterBookDto) {
  //   const { limit, offset, title } = params || {};
  //   const where: FindOptionsWhere<Book> = {};

  //   if (title) {
  //     where.title = ILike(`%${title}%`);
  //   }

  //   return this.bookRepository.find({
  //     order: { id: 'ASC' },
  //     where,
  //     take: limit,
  //     skip: offset,
  //     relations: {
  //       author: true,
  //       genre: true,
  //     },
  //   });
  // }

  async create(createBookDto: CreateBookDto) {
    // user: User
    try {
      const {
        title,
        publication_year,
        isAvailable,
        author_id,
        publisher_id,
        genre_id,
        image,
      } = createBookDto;
      const genres = await this.genreRepository.findBy({
        id: In(genre_id ?? []),
      });

      const author = await this.authorRepository.findOneBy({ id: author_id });
      if (!author) {
        throw new NotFoundException(
          `El autor con id ${author_id} no fue encontrado`,
        );
      }

      const publisher = await this.publisherRepository.findOneBy({
        id: publisher_id,
      });
      if (!publisher) {
        throw new NotFoundException(
          `El publisher con id ${publisher_id} no fue encontrado`,
        );
      }

      const book = this.bookRepository.create({
        title,
        publication_year,
        isAvailable,
        genre: genres,
        publisher,
        author,
        //user,
        image,
      });
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, changes: UpdateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { genre: true, author: true, user: true, publisher: true },
    });

    if (!book) {
      throw new NotFoundException(`El libro con id ${id} no fue encontrado`);
    }

    // Actualizar géneros (muchos a muchos)
    if (changes.genre_id) {
      const genres = await this.genreRepository.findBy({
        id: In(
          Array.isArray(changes.genre_id)
            ? changes.genre_id
            : [changes.genre_id],
        ),
      });
      if (!genres.length) {
        throw new NotFoundException(
          `No se encontraron géneros con los ids: ${Array.isArray(changes.genre_id) ? changes.genre_id.join(', ') : changes.genre_id}`,
        );
      }
      book.genre = genres;
    }

    if (changes.author_id) {
      const author = await this.authorRepository.findOneBy({
        id: changes.author_id,
      });
      if (!author) {
        throw new NotFoundException(
          `El autor con id ${changes.author_id} no fue encontrado`,
        );
      }
      book.author = author;
    }

    if (changes.publisher_id) {
      const publisher = await this.publisherRepository.findOneBy({
        id: changes.publisher_id,
      });
      if (!publisher) {
        throw new NotFoundException(
          `El publisher con id ${changes.publisher_id} no fue encontrado`,
        );
      }
      book.publisher = publisher;
    }

    // if (user) {
    //   book.user = user;
    // }

    // Actualizar otros campos simples
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

  // async deleteAllBooks() {
  //   const query = this.bookRepository.createQueryBuilder('book');
  //   try {
  //     return await query.delete().where({}).execute();
  //   } catch (error) {
  //     this.handleDBException(error);
  //   }
  // }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
