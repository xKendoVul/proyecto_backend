import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateGenreDto, UpdateGenreDto } from '../dto/genre.dto';
import { GenreService } from '../services/genre.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getFindAll(@Query() pagination: PaginationDto) {
    return this.genreService.findAll(pagination);
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

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(id, updateGenreDto);
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
