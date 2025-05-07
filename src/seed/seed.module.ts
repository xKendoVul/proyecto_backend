import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { BooksModule } from 'src/modules/books/books.module';
import { LoansModule } from 'src/modules/loans/loans.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [BooksModule, LoansModule],
})
export class SeedModule {}
