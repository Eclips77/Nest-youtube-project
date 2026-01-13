import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video, VideoSchema } from './schemas/video.schema';
import { MongoVideoRepository } from './repositories/mongo-video.repository';
import { JsonVideoRepository } from './repositories/json-video.repository';
import { VIDEO_REPOSITORY } from '../../common/constants/tokens';
import { DbType } from '../../common/constants/enums';
import { StorageModule } from '../../core/storage/storage.module';
import { EncodingModule } from '../encoding/encoding.module';
import { GenresModule } from '../genres/genres.module';
import { GenreExistsPipe } from './pipes/genre-exists.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    StorageModule,
    EncodingModule,
    GenresModule, // Import GenresModule to use GenreExistsPipe which depends on GenreService/Repo
  ],
  controllers: [VideosController],
  providers: [
    VideosService,
    MongoVideoRepository,
    JsonVideoRepository,
    GenreExistsPipe,
    {
      provide: VIDEO_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoVideoRepository,
        jsonRepo: JsonVideoRepository,
      ) => {
        return configService.get('DB_TYPE') === DbType.MONGO
          ? mongoRepo
          : jsonRepo;
      },
      inject: [ConfigService, MongoVideoRepository, JsonVideoRepository],
    },
  ],
  exports: [VIDEO_REPOSITORY, VideosService],
})
export class VideosModule {}
