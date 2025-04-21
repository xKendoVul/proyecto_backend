import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { GenreModule } from './modules/genre/genre.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansModule } from './modules/loans/loans.module';

@Module({
  imports: [
    BooksModule,
    GenreModule, 
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
