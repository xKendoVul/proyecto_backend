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
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
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
  @Auth(ValidRoles.admin)
  async create(@Body() CreateBookDto: CreateBookDto, @GetUser() user: User) {
    const nuevo = await this.BooksService.create(CreateBookDto, user);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
    @GetUser() user: User,
  ) {
    const datos = await this.BooksService.update(id, updateBookDto, user);
    const data = {
      data: datos,
      message: 'Registro actualizado correctamente',
    };
    return data;
  }

  @Delete()
  @Auth(ValidRoles.admin)
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
