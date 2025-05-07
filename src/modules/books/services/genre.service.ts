import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { CreateGenreDto, FilterGenreDto } from '../dto/genre.dto';

@Injectable()
export class GenreService {
  private readonly logger = new Logger('GenreService');

  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  findAll(params?: FilterGenreDto) {
    const { limit, offset, name } = params || {};
    const where: FindOptionsWhere<Genre> = {};

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    return this.genreRepository.find({
      order: { id: 'ASC' },
      where,
      take: limit,
      skip: offset,
      relations: {
        books: true,
      },
    });
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

  async create(createGenreDto: CreateGenreDto) {
    try {
      const genre = this.genreRepository.create(createGenreDto);
      await this.genreRepository.save(genre);
      return genre;
    } catch (error) {
      this.handleDBException(error);
    }
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
