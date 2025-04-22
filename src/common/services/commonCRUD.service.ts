import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class CommonCRUDService<
  Entity extends { id: number },
  CreateDto = any,
  UpdateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
> {
  protected readonly logger = new Logger(CommonCRUDService.name);

  constructor(protected readonly repository: Repository<Entity>) {}

  async create(createDto: CreateDto): Promise<Entity> {
    try {
      const entity = this.repository.create(createDto as DeepPartial<Entity>);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(`Error creando la entidad`, error.stack);
      this.handleDBException(error);
    }
  }

  async findOne(id: number): Promise<Entity> {
    const entity = await this.repository.findOneBy({ id } as any);
    if (!entity) {
      throw new NotFoundException(`No se encontró la entidad con id ${id}`);
    }
    return entity;
  }

  async findAll(paginationDto: PaginationDto): Promise<Entity[]> {
    const { limit = 3, offset = 0 } = paginationDto;
    return this.repository.find({
      take: limit,
      skip: offset,
    });
  }

  async update(id: number, updateDto: UpdateDto): Promise<Entity> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
    });
    if (!entity) {
      throw new NotFoundException(`No se encontró la entidad con id ${id}`);
    }
    try {
      this.repository.merge(entity, updateDto);
      await this.repository.save(entity);
      return entity;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
    });
    if (!entity) {
      throw new NotFoundException(`No se encontró la entidad con id ${id}`);
    }
    await this.repository.softDelete(id);

    return {
      message: `Se eliminó la entidad con id ${id}`,
    };
  }

  protected handleDBException(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      `Error inesperado, se deben de verificar los registros del servidor`,
    );
  }
}
