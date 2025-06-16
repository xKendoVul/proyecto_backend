import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Genre } from './genre.entity';
import { Author } from './author.entity';
import { Publisher } from './publisher.entity';
import { Loan } from 'src/modules/loans/entities/loan.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ManyToMany(() => Genre, (genre) => genre.books)
  @JoinTable({
    name: 'book_genre',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'genre_id',
      referencedColumnName: 'id',
    },
  })
  genre: Genre[];

  @ManyToOne(() => Author)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Author;

  @ManyToOne(() => Publisher)
  @JoinColumn({ name: 'publisher_id', referencedColumnName: 'id' })
  publisher: Publisher;

  @Column({ type: 'int4' })
  publication_year: number;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;

  @ManyToOne(() => User, (user) => user.book, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'varchar' })
  image?: string;

  @ManyToMany(() => Loan, (loan) => loan.books)
  loans: Loan[];

  @Column({ type: 'int4', default: 1 })
  total_copies: number;

  @Column({ type: 'int4', default: 1 })
  available_copies: number;

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
