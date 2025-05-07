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

interface SeedData {
  books: SeedBooks[];
  genres: SeedGenres[];
  authors: SeedAuthors[];
}
// interface SeedDataBrand {
//   brands: SeedBrand[];
// }

// export const initialDataBrand: SeedDataBrand = {
//   brands: [
//     {
//       name: 'Tesla',
//       description: 'Vehículos eléctricos con diseño y tecnología avanzada.',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       name: 'Ford',
//       description: 'Marca icónica con enfoque en innovación y electrificación.',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       name: 'Volkswagen',
//       description: 'Ingeniería alemana con visión sostenible y moderna.',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       name: 'Rivian',
//       description: 'SUVs y camionetas eléctricas pensadas para la aventura.',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ],
// };

export const initialData: SeedData = {
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
