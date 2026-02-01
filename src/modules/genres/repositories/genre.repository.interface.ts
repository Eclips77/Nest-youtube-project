import { Genre } from '../schemas/genre.schema';
import { ClientSession } from 'mongoose';

export interface IGenreRepository {
  create(genre: Genre, options?: { session?: ClientSession }): Promise<Genre>;
  findAll(): Promise<Genre[]>;
  findById(id: string): Promise<Genre | null>;
}
