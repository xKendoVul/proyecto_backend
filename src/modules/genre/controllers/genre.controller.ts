import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenreService} from '../services/genre.service';
import { CreateGenreDto } from '../dto/genre.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  getGenreAll() {
    return 'Todos los generos';
  }

  @Post()
  creategenre(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }
}
