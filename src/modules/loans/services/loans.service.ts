import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoanDto, UpdateLoanDto } from '../dto/loan.dto';
import { Loan } from '../entities/loan.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LoansService {
  private readonly logger = new Logger('LoansService');

  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    const loan = await this.loanRepository.findOne({
      where: { id: id },
      relations: { books: true, user: true },
    });

    if (!loan) {
      throw new NotFoundException(
        `El préstamo con id ${id} no fue encontrado en la base de datos`,
      );
    }
    return loan;
  }

  async findAll(pagination: PaginationDto) {
    const [data, total] = await this.loanRepository.findAndCount({
      take: pagination.limit,
      skip: pagination.offset,
      order: { id: 'ASC' },
      relations: { books: true, user: true },
    });
    return { data, total };
  }

  async create(createLoanDto: CreateLoanDto) {
    const user = await this.userRepository.findOneBy({
      id: createLoanDto.user_id,
    });
    if (!user)
      throw new NotFoundException(
        `El usuario con id ${createLoanDto.user_id} no fue encontrado en la base de datos`,
      );

    const books = await this.bookRepository.findByIds(createLoanDto.book_id);
    if (books.length !== createLoanDto.book_id.length) {
      throw new BadRequestException('Uno o más libros no existen');
    }

    // Solo verifica disponibilidad, NO restes copias aquí
    const unavailableBooks = books.filter((book) => book.available_copies <= 0);
    if (unavailableBooks.length > 0) {
      const titles = unavailableBooks.map((b) => b.title).join(', ');
      throw new BadRequestException(
        `No hay ejemplares disponibles para: ${titles}`,
      );
    }

    const loan = this.loanRepository.create({
      books,
      user,
      loan_date: createLoanDto.loan_date,
      return_date: createLoanDto.return_date,
      isReturned: false,
    });

    return this.loanRepository.save(loan);
  }

  // loans.service.ts
  async confirmLoan(id: number) {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: { books: true },
    });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');
    if (loan.state) throw new BadRequestException('Ya confirmado');

    // Por cada libro solicitado
    for (const book of loan.books) {
      if (book.available_copies <= 0) {
        throw new BadRequestException(
          `No hay copias disponibles de ${book.title}`,
        );
      }
      book.available_copies -= 1;
      if (book.available_copies === 0) {
        book.isAvailable = false;
      }
      await this.bookRepository.save(book);
    }

    loan.state = true;
    return this.loanRepository.save(loan);
  }

  async denyLoan(id: number) {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: { books: true },
    });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');
    if (loan.state)
      throw new BadRequestException(
        'No se puede denegar un préstamo ya aceptado',
      );

    for (const book of loan.books) {
      book.available_copies += 1;
      // Si hay al menos una copia, marcar como disponible
      if (book.available_copies > 0) {
        book.isAvailable = true;
      }
      await this.bookRepository.save(book);
    }

    await this.loanRepository.remove(loan);
    return { message: 'Préstamo denegado y ejemplares devueltos' };
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
