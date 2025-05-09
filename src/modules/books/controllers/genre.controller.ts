import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateGenreDto, FilterGenreDto } from '../dto/genre.dto';
import { GenreService } from '../services/genre.service';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
  @Get()
  async getBooksAll(@Query() params: FilterGenreDto) {
    const rows = await this.genreService.findAll(params);

    const data = {
      data: rows,
    };
    return data;
  }

  // optener un objeto por id
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.genreService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    const nuevo = await this.genreService.create(createGenreDto);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }
  @Delete()
  async removeAll() {
    const dato = await this.genreService.deleteAllGenres();
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
    const dato = await this.genreService.remove(id);
    const data = {
      data: dato,
      message: 'Registro eliminado correctamente',
    };
    return data;
  }
}
