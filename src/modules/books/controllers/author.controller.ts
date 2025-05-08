import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateAuthorDto, FilterAuthorDto } from '../dto/author.dto';
import { AuthorService } from '../services/author.service';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAuthorAll(@Query() params: FilterAuthorDto) {
    const rows = await this.authorService.findAll(params);

    const data = {
      data: rows,
    };
    return data;
  }

  // optener un objeto por id
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.authorService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    const nuevo = await this.authorService.create(createAuthorDto);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }
  @Delete()
  async removeAll() {
    const dato = await this.authorService.deleteAllAuthors();
    const data = {
      data: dato,
      message: 'Registros eliminados correctamente',
    };
    return data;
  }
  // Actualizar un objeto
  // Eliminar un objeto
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const dato = await this.authorService.remove(id);
    const data = {
      data: dato,
      message: 'Registro eliminado correctamente',
    };
    return data;
  }
}
