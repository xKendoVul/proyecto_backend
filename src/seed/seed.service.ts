import { Injectable } from '@nestjs/common';
import { BooksService } from 'src/modules/books/services/books.service';
import { AuthorService } from 'src/modules/books/services/author.service';
import { initialData } from './data/seed-data';
import { Author } from 'src/modules/books/entities/author.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { Genre } from 'src/modules/books/entities/genre.entity';
import { GenreService } from 'src/modules/books/services/genre.service';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly bookService: BooksService,
    private readonly genreService: GenreService,
    private readonly authorService: AuthorService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeedBooks() {
    await this.deleteTables();

    const adminUser = await this.insertUsers();

    await this.insertNewBooks(adminUser);
    return 'SEED EXECUTED BOOKS';
  }
  async runSeedGenres() {
    await this.deleteTables();
    await this.insertNewGenres();
    return 'SEED EXECUTED GENRES';
  }
  async runSeedAuthors() {
    await this.deleteTables();
    await this.insertNewAuthors();
    return 'SEED EXECUTED AUTHORS';
  }

  private async deleteTables() {
    await this.bookService.deleteAllBooks();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUser = await this.userRepository.save(seedUsers);

    return dbUser[0];
  }
  private async insertNewBooks(user: User) {
    await this.bookService.deleteAllBooks();

    const books = initialData.books;
    const insertPromises: Promise<Book | undefined>[] = [];

    books.forEach((book) => {
      insertPromises.push(this.bookService.create(book, user));
    });

    await Promise.all(insertPromises);
    return true;
  }

  private async insertNewGenres() {
    await this.genreService.deleteAllGenres();

    const genres = initialData.genres;
    const insertPromises: Promise<Genre | undefined>[] = [];

    // genres.forEach((genre) => {
    //   insertPromises.push(this.genreService.create(genre));
    // });

    await Promise.all(insertPromises);

    return true;
  }

  private async insertNewAuthors() {
    await this.authorService.deleteAllAuthors();

    const authors = initialData.authors;
    const insertPromises: Promise<Author | undefined>[] = [];

    authors.forEach((author) => {
      insertPromises.push(this.authorService.create(author));
    });
    await Promise.all(insertPromises);
    return true;
  }
}
