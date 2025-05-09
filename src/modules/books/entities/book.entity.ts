import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Genre } from './genre.entity';
import { Author } from './author.entity';

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
    },
    inverseJoinColumn: {
      name: 'genre_id',
    },
  })
  genre: Genre[];

  @ManyToOne(() => Author, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Author;

  @Column({ type: 'varchar', length: 50 })
  publisher: string;

  @Column({ type: 'int4' })
  publication_year: number;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;

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
