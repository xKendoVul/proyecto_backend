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
import {
  CreateAuthorDto,
  UpdateAuthorDto,
  FilterAuthorDto,
} from '../dto/author.dto';

@Injectable()
export class AuthorService {
  private readonly logger = new Logger('AuthorService');

  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  findAll(params?: FilterAuthorDto) {
    const { limit, offset, name } = params || {};
    const where: FindOptionsWhere<Author> = {};

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    return this.authorRepository.find({
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

  async remove(id: number) {
    const exist = await this.authorRepository.existsBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `El autor con id ${id} no fue encontrado en la base de datos`,
      );
    }
    await this.authorRepository.delete(id);
    return {
      message: 'Registro eliminado correctamente',
      deletedAt: new Date(),
    };
  }

  async deleteAllAuthors() {
    const query = this.authorRepository.createQueryBuilder('author');
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
