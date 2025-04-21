import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { GenreController } from './controllers/genre.controller';
import { BooksService, GenreService } from './services/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Book } from './entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Genre]),
  ],
  controllers: [BooksController, GenreController],
  providers: [BooksService, GenreService],
  exports: [TypeOrmModule, BooksService, GenreService],
})
export class BooksModule {}
