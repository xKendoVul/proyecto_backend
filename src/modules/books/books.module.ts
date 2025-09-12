import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { GenreController } from './controllers/genre.controller';
import { GenreService } from './services/genre.service';
import { BooksService } from './services/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Book } from './entities/book.entity';
import { Author } from './entities/author.entity';
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';
import { AuthModule } from 'src/auth/auth.module';
import { Publisher } from './entities/publisher.entity';
import { PublisherController } from './controllers/publisher.controller';
import { PublisherService } from './services/publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Genre, Author, Publisher]),
    AuthModule,
  ],
  controllers: [
    BooksController,
    GenreController,
    AuthorController,
    PublisherController,
  ],
  providers: [BooksService, GenreService, AuthorService, PublisherService],
  exports: [
    TypeOrmModule,
    BooksService,
    GenreService,
    AuthorService,
    PublisherService,
  ],
})
export class BooksModule {}
