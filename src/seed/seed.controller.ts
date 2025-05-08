import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('books')
  executeSeedBooks() {
    return this.seedService.runSeedBooks();
  }

  @Get('genres')
  executeSeedGenres() {
    return this.seedService.runSeedGenres();
  }

  @Get('authors')
  executeSeedAuthors() {
    return this.seedService.runSeedAuthors();
  }
}
