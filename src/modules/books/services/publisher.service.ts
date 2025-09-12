import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from '../entities/publisher.entity';
import { CreatePublisherDto, UpdatePublisherDto } from '../dto/publisher.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PublisherService {
  private readonly logger = new Logger('PublisherService');

  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}

  async create(createPublisherDto: CreatePublisherDto) {
    try {
      const publisher = this.publisherRepository.create(createPublisherDto);
      await this.publisherRepository.save(publisher);
      return publisher;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const [data, total] = await this.publisherRepository.findAndCount({
      take: pagination.limit,
      skip: pagination.offset,
    });
    return { data, total };
  }

  async findOne(id: number) {
    const publisher = await this.publisherRepository.findOne({
      where: { id: id },
      relations: { books: true },
    });

    if (!publisher) {
      throw new NotFoundException(
        `El genero con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return publisher;
  }

  async update(id: number, updatePublisherDto: UpdatePublisherDto) {
    const publisher = await this.publisherRepository.findOne({ where: { id } });

    if (!publisher) {
      throw new NotFoundException(`Brand con id ${id} no encontrado`);
    }

    try {
      this.publisherRepository.merge(publisher, updatePublisherDto);
      await this.publisherRepository.save(publisher);

      return {
        message: 'Registro actualizado  con éxito',
        data: publisher,
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const exist = await this.publisherRepository.existsBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `El genero con id ${id} no fue encontrado en la base de datos`,
      );
    }
    await this.publisherRepository.delete(id);
    return {
      message: 'Registro eliminado correctamente',
      deletedAt: new Date(),
    };
  }

  // async deleteAllGenres() {
  //   const query = this.genreRepository.createQueryBuilder('genre');
  //   try {
  //     return await query.delete().where({}).execute();
  //   } catch (error) {
  //     this.handleDBException(error);
  //   }
  // }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
