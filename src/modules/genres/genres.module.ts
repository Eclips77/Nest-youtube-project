import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { MongoGenreRepository } from './repositories/mongo-genre.repository';
import { JsonGenreRepository } from './repositories/json-genre.repository';
import { GENRE_REPOSITORY } from '../../common/constants/tokens';
import { DbType } from '../../common/constants/enums';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  controllers: [GenresController],
  providers: [
    GenresService,
    MongoGenreRepository,
    JsonGenreRepository,
    {
      provide: GENRE_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoGenreRepository,
        jsonRepo: JsonGenreRepository,
      ) => {
        return configService.get('DB_TYPE') === DbType.MONGO
          ? mongoRepo
          : jsonRepo;
      },
      inject: [ConfigService, MongoGenreRepository, JsonGenreRepository],
    },
  ],
  exports: [GENRE_REPOSITORY, GenresService],
})
export class GenresModule {}
