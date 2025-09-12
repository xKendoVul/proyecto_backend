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
import { CreateAuthorDto } from '../dto/author.dto';
import { AuthorService } from '../services/author.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAuthorAll(@Query() pagination: PaginationDto) {
    return this.authorService.findAll(pagination);
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

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAuthorDto: CreateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

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
