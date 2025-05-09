import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { CreateBookDto, FilterBookDto, UpdateBookDto } from '../dto/book.dto';
// import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly BooksService: BooksService) {}

  // optener el objeto junto con la paginacion
  @Get()
  async getBooksAll(@Query() params: FilterBookDto) {
    const rows = await this.BooksService.findAll(params);

    const data = {
      data: rows,
    };
    return data;
  }

  // optener un objeto por id
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.BooksService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  // Crear un objeto nuevo
  @Post()
  async create(@Body() CreateBookDto: CreateBookDto) {
    const nuevo = await this.BooksService.create(CreateBookDto);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    const datos = await this.BooksService.update(id, updateBookDto);
    const data = {
      data: datos,
      message: 'Registro actualizado correctamente',
    };
    return data;
  }

  @Delete()
  async removeAll() {
    const dato = await this.BooksService.deleteAllBooks();
    const data = {
      data: dato,
      message: 'Registros eliminados correctamente',
    };
    return data;
  }

  // Eliminar un objeto
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const dato = await this.BooksService.remove(id);
    const data = {
      data: dato,
      message: 'Registro eliminado correctamente',
    };
    return data;
  }
}
