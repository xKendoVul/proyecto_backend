import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [TypeOrmModule, BooksService],
})
export class BooksModule { }
