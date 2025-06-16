import { Module } from '@nestjs/common';
import { LoansController } from './controllers/loans.controller';
import { LoansService } from './services/loans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { BooksService } from '../books/services/books.service';
import { BooksModule } from '../books/books.module';
import { Book } from '../books/entities/book.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, User]), BooksModule],
  controllers: [LoansController],
  providers: [LoansService, BooksService],
})
export class LoansModule {}
