import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly BooksService: BooksService) {}

  // optener el objeto junto con la paginacion
  @Get()
  getBooksAll(@Query() PaginationDto: PaginationDto) {
    console.log(PaginationDto);
    return this.BooksService.findAll(PaginationDto);
  }

  // Crear un objeto nuevo
  @Post()
  createBook(@Body() CreateBookDto: CreateBookDto) {
    return this.BooksService.create(CreateBookDto);
  }

  // optener un objeto por id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.BooksService.findOne(id);
  }

  // Actualizar parcialmente un objeto
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.BooksService.update(id, updateBookDto);
  }

  // Eliminar un objeto
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.BooksService.remove(id);
  }
}
