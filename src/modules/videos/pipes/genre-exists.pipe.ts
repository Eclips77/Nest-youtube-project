import { PipeTransform, Injectable, BadRequestException, Inject } from '@nestjs/common';
import { GENRE_REPOSITORY } from '../../../common/constants/tokens';
import type { IGenreRepository } from '../../genres/repositories/genre.repository.interface';
import { CreateVideoDto } from '../dto/create-video.dto';

@Injectable()
export class GenreExistsPipe implements PipeTransform {
  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: IGenreRepository,
  ) {}

  async transform(value: CreateVideoDto) {
    if (!value.genreId) {
       // Validation handled by class-validator usually, but safe to check
       return value;
    }

    const genre = await this.genreRepository.findById(value.genreId);
    if (!genre) {
      throw new BadRequestException(`Genre with ID ${value.genreId} does not exist`);
    }
    return value;
  }
}
