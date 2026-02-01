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
import { UsersModule } from '../users/users.module'; // Added UsersModule
import { GenreExistsPipe } from './pipes/genre-exists.pipe';
import { VideoSagaService } from './video-saga.service';
import { RollbackManager } from '../../common/managers/rollback.manager'; // Ideally provided globally or here

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    StorageModule,
    EncodingModule,
    GenresModule,
    UsersModule,
  ],
  controllers: [VideosController],
  providers: [
    VideosService,
    VideoSagaService, // Registered Saga Service
    RollbackManager, // Registered Manager (Request Scoped)
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
  exports: [VIDEO_REPOSITORY, VideosService, VideoSagaService],
})
export class VideosModule {}
