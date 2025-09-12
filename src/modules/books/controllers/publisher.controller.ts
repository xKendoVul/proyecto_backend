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
import { CreatePublisherDto, UpdatePublisherDto } from '../dto/publisher.dto';
import { PublisherService } from '../services/publisher.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  async getFindAll(@Query() pagination: PaginationDto) {
    return this.publisherService.findAll(pagination);
  }

  // optener un objeto por id
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.publisherService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Post()
  async create(@Body() createPublisherDto: CreatePublisherDto) {
    const nuevo = await this.publisherService.create(createPublisherDto);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publisherService.update(id, updatePublisherDto);
  }

  // @Delete()
  // async removeAll() {
  //   const dato = await this.publisherService.deleteAllPublishers();
  //   const data = {
  //     data: dato,
  //     message: 'Registros eliminados correctamente',
  //   };
  //   return data;
  // }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const dato = await this.publisherService.remove(id);
    const data = {
      data: dato,
      message: 'Registro eliminado correctamente',
    };
    return data;
  }
}
