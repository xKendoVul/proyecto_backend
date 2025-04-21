import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

}