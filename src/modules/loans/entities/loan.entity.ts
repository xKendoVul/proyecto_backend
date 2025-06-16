import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Book } from 'src/modules/books/entities/book.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @ManyToMany(() => Book, (book) => book.loans)
  @JoinTable({
    name: 'loan_book',
    joinColumn: {
      name: 'loan_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
  })
  books: Book[];

  @ManyToOne(() => User, (user) => user.loan)
  user: User;

  @Column({ type: 'date' })
  loan_date: Date;

  @Column({ type: 'bool', default: false })
  state: boolean;

  @Column({ type: 'date' })
  return_date: Date;

  @Column({ type: 'bool', default: false })
  isReturned: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
