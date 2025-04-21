import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { CreateBookDto } from '../dto/book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly BooksService: BooksService) { }

  @Get()
  getBooksAll() {
    return 'todos los libros';
  }

  @Post()
  createBook(@Body() CreateBookDto: CreateBookDto) {
    return this.BooksService.create(CreateBookDto);
  }
}
