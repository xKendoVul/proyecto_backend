import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { GenreController } from './controllers/genre.controller';
import { GenreService } from './services/genre.service';
import { BooksService } from './services/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Book } from './entities/book.entity';
import { Author } from './entities/author.entity';
<<<<<<< HEAD
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';
=======
import { AuthorService } from './services/author.service';
import { AuthorController } from './controllers/author.controller';
>>>>>>> 436d768ec6b966f82ea8b32aa27fc2e5d6a9508b

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Genre]),
    TypeOrmModule.forFeature([Author]),
  ],
  controllers: [BooksController, GenreController, AuthorController],
  providers: [BooksService, GenreService, AuthorService],
  exports: [TypeOrmModule, BooksService, GenreService, AuthorService],
})
export class BooksModule {}
