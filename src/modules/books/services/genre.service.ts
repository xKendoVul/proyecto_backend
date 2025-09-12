import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { CreateGenreDto, UpdateGenreDto } from '../dto/genre.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class GenreService {
  private readonly logger = new Logger('GenreService');

  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      const genre = this.genreRepository.create(createGenreDto);
      await this.genreRepository.save(genre);
      return genre;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const [data, total] = await this.genreRepository.findAndCount({
      take: pagination.limit,
      skip: pagination.offset,
    });
    return { data, total };
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findOne({
      where: { id: id },
      relations: { books: true },
    });

    if (!genre) {
      throw new NotFoundException(
        `El genero con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundException(`Brand con id ${id} no encontrado`);
    }

    try {
      this.genreRepository.merge(genre, updateGenreDto);
      await this.genreRepository.save(genre);

      return {
        message: 'Registro actualizado  con éxito',
        data: genre,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exist = await this.genreRepository.existsBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `El genero con id ${id} no fue encontrado en la base de datos`,
      );
    }
    await this.genreRepository.delete(id);
    return {
      message: 'Registro eliminado correctamente',
      deletedAt: new Date(),
    };
  }

  async deleteAllGenres() {
    const query = this.genreRepository.createQueryBuilder('genre');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
