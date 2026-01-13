import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGenreRepository } from './genre.repository.interface';
import { Genre, GenreDocument } from '../schemas/genre.schema';

@Injectable()
export class MongoGenreRepository implements IGenreRepository {
  constructor(@InjectModel(Genre.name) private genreModel: Model<GenreDocument>) {}

  async create(genre: Genre): Promise<Genre> {
    const createdGenre = new this.genreModel(genre);
    return createdGenre.save();
  }

  async findAll(): Promise<Genre[]> {
    return this.genreModel.find().exec();
  }

  async findById(id: string): Promise<Genre | null> {
    return this.genreModel.findById(id).exec();
  }
}
