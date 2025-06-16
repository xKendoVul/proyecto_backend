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
    if (!user) {
      throw new NotFoundException(
        `El usuario con id ${createLoanDto.user_id} no fue encontrado en la base de datos`,
      );
    }

    const books = await this.bookRepository.findByIds(createLoanDto.book_id);
    if (books.length !== createLoanDto.book_id.length) {
      throw new BadRequestException('Uno o más libros no existen');
    }

    const unavailableBooks = books.filter((book) => book.available_copies <= 0);
    if (unavailableBooks.length > 0) {
      const titles = unavailableBooks.map((b) => b.title).join(', ');
      throw new BadRequestException(
        `No hay ejemplares disponibles para: ${titles}`,
      );
    }

    for (const book of books) {
      book.available_copies -= 1;
      await this.bookRepository.save(book);
    }

    const loan = this.loanRepository.create({
      books,
      user,
      loan_date: createLoanDto.loan_date,
      return_date: createLoanDto.return_date,
      // state: createLoanDto.state ?? false,
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
    // Regresar los ejemplares
    for (const book of loan.books) {
      book.available_copies += 1;
      await this.bookRepository.save(book);
    }
    await this.loanRepository.remove(loan); // O marca como denegado si prefieres
    return { message: 'Préstamo denegado y ejemplares devueltos' };
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: { books: true, user: true },
    });

    if (!loan) {
      throw new NotFoundException(
        `El préstamo con id ${id} no fue encontrado en la base de datos`,
      );
    }

    if (loan.isReturned) {
      throw new BadRequestException(
        `El préstamo con id ${id} ya ha sido devuelto y no puede ser modificado`,
      );
    }

    for (const book of loan.books) {
      book.available_copies += 1;
      await this.bookRepository.save(book);
    }
    loan.isReturned = true;
    return this.loanRepository.save(loan);
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
