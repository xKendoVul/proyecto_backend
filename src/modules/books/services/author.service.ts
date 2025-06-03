import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto, FilterAuthorDto } from '../dto/author.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AuthorService {
  private readonly logger = new Logger('AuthorService');

  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async findAll(pagination: PaginationDto) {
    const [data, total] = await this.authorRepository.findAndCount({
      take: pagination.limit,
      skip: pagination.offset,
    });
    return { data, total };
  }

  async findOne(id: number) {
    const author = await this.authorRepository.findOne({
      where: { id: id },
      relations: { books: true },
    });

    if (!author) {
      throw new NotFoundException(
        `El genero con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return author;
  }

  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const author = this.authorRepository.create(createAuthorDto);
      await this.authorRepository.save(author);
      return author;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async update(id: number, updateAuthorDto: CreateAuthorDto) {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(
        `El autor con id ${id} no fue encontrado en la base de datos`,
      );
    }
    try {
      this.authorRepository.merge(author, updateAuthorDto);
      await this.authorRepository.save(author);

      return {
        message: 'Registro actualizado correctamente',
        data: author,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exist = await this.authorRepository.existsBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `El autor con id ${id} no fue encontrado en la base de datos`,
      );
    }
    try {
      await this.authorRepository.delete(id);
      return {
        message: 'Registro eliminado correctamente',
        deletedAt: new Date(),
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.code === '23503')
      throw new BadRequestException(
        'No se puede eliminar el autor porque tiene libros asociados',
      );

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
