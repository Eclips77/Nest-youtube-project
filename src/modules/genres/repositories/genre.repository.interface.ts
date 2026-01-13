import { Genre } from '../schemas/genre.schema';

export interface IGenreRepository {
  create(genre: Genre): Promise<Genre>;
  findAll(): Promise<Genre[]>;
  findById(id: string): Promise<Genre | null>;
}
