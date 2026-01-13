import { Injectable, Inject } from '@nestjs/common';
import type { IGenreRepository } from './repositories/genre.repository.interface';
import { GENRE_REPOSITORY } from '../../common/constants/tokens';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: IGenreRepository,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    return this.genreRepository.create(createGenreDto);
  }

  async findAll() {
    return this.genreRepository.findAll();
  }
}
