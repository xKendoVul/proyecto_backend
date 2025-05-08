import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { LoansModule } from './modules/loans/loans.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { BooksController } from './modules/books/controllers/books.controller';
import { GenreController } from './modules/books/controllers/genre.controller';
import { AuthorController } from './modules/books/controllers/author.controller';
import { BooksService } from './modules/books/services/books.service';
import { GenreService } from './modules/books/services/genre.service';
import { AuthorService } from './modules/books/services/author.service';

@Module({
  imports: [
    BooksModule,
    LoansModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    SeedModule,
    AuthModule,
  ],
  controllers: [BooksController, GenreController, AuthorController],
  providers: [BooksService, GenreService, AuthorService],
})
export class AppModule {}
