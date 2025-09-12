import * as bcrypt from 'bcrypt';

interface SeedBooks {
  title: string;
  genre_id: number[];
  author_id: number;
  publisher: string;
  publication_year: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface SeedGenres {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface SeedAuthors {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface SeedUsers {
  email: string;
  fullname: string;
  password: string;
  roles: string[];
}

interface SeedData {
  users: SeedUsers[];
  books: SeedBooks[];
  genres: SeedGenres[];
  authors: SeedAuthors[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@google.com',
      fullname: 'Test One',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['admin'],
    },
    {
      email: 'test2@google.com',
      fullname: 'Test Two',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user', 'super-user'],
    },
    {
      email: 'gabrielgriffin@gmail.com',
      fullname: 'Gabriel Griffin',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['admin', 'super-user'],
    },
  ],
  books: [
    {
      title: 'El senor de los anillos',
      genre_id: [1],
      author_id: 1,
      publisher: 'Editorial XYZ',
      publication_year: 2001,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'El hobbit',
      genre_id: [1],
      author_id: 1,
      publisher: 'Editorial ABC',
      publication_year: 2005,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: '1984',
      genre_id: [2, 3],
      author_id: 4,
      publisher: 'Editorial DEF',
      publication_year: 2010,
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Cien años de soledad',
      genre_id: [4],
      author_id: 3,
      publisher: 'Editorial GHI',
      publication_year: 2015,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  genres: [
    {
      name: 'Fantasía',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Ciencia ficción',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Distopía',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Realismo mágico',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  authors: [
    {
      name: 'J.R.R. Tolkien',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'George Orwell',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Gabriel García Márquez',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Isaac Asimov',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};
