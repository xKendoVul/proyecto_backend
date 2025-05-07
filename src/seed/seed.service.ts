import { Injectable } from '@nestjs/common';
import { BooksService } from 'src/modules/books/services/books.service';
import { initialData } from './data/seed-data';
import { Book } from 'src/modules/books/entities/book.entity';
import { Genre } from 'src/modules/books/entities/genre.entity';
import { GenreService } from 'src/modules/books/services/genre.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly bookService: BooksService,
    private readonly genreService: GenreService,
  ) {}

  async runSeed() {
    await this.insertNewBooks();
    return 'SEED EXECUTED CARS';
  }
  async runSeedGenres() {
    await this.insertNewGenres();
    return 'SEED EXECUTED BRANDS';
  }

  private async insertNewBooks() {
    await this.bookService.deleteAllBooks();

    const cars = initialData.books;
    const insertPromises: Promise<Book | undefined>[] = [];

    cars.forEach((book) => {
      insertPromises.push(this.bookService.create(book));
    });

    await Promise.all(insertPromises);

    return true;
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
}
