import { Injectable } from '@nestjs/common';
import { BooksService } from 'src/modules/books/services/books.service';
import { AuthorService } from 'src/modules/books/services/author.service';
import { initialData } from './data/seed-data';
import { Author } from 'src/modules/books/entities/author.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { Genre } from 'src/modules/books/entities/genre.entity';
import { GenreService } from 'src/modules/books/services/genre.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly bookService: BooksService,
    private readonly genreService: GenreService,
    private readonly authorService: AuthorService,
  ) {}

  async runSeedBooks() {
    await this.insertNewBooks();
    return 'SEED EXECUTED BOOKS';
  }
  async runSeedGenres() {
    await this.insertNewGenres();
    return 'SEED EXECUTED GENRES';
  }
  async runSeedAuthors() {
    await this.insertNewAuthors();
    return 'SEED EXECUTED AUTHORS';
  }

  private async insertNewBooks() {
    await this.bookService.deleteAllBooks();

    for (const book of initialData.books) {
      const author = await this.authorService.findOne(book.author_id);

      const genres_id = Array.isArray(book.genre_id)
        ? book.genre_id
        : [book.genre_id];
      const genres = await Promise.all(
        genres_id.map((id) => this.genreService.findOne(id)),
      );

      await this.bookService.create({
        ...book,
        author,
        genres,
      });
    }
  }

  private async insertNewGenres() {
    await this.genreService.deleteAllGenres();

    const brands = initialData.genres;
    const insertPromises: Promise<Genre | undefined>[] = [];

    brands.forEach((genre) => {
      insertPromises.push(this.genreService.create(genre));
    });

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
