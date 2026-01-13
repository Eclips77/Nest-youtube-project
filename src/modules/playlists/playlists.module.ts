import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';
import { MongoPlaylistRepository } from './repositories/mongo-playlist.repository';
import { JsonPlaylistRepository } from './repositories/json-playlist.repository';
import { PLAYLIST_REPOSITORY } from '../../common/constants/tokens';
import { DbType } from '../../common/constants/enums';
import { VideosModule } from '../videos/videos.module';
import { VideosExistPipe } from './pipes/videos-exist.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Playlist.name, schema: PlaylistSchema }]),
    VideosModule,
  ],
  controllers: [PlaylistsController],
  providers: [
    PlaylistsService,
    MongoPlaylistRepository,
    JsonPlaylistRepository,
    VideosExistPipe,
    {
      provide: PLAYLIST_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoPlaylistRepository,
        jsonRepo: JsonPlaylistRepository,
      ) => {
        return configService.get('DB_TYPE') === DbType.MONGO
          ? mongoRepo
          : jsonRepo;
      },
      inject: [ConfigService, MongoPlaylistRepository, JsonPlaylistRepository],
    },
  ],
  exports: [PLAYLIST_REPOSITORY, PlaylistsService],
})
export class PlaylistsModule {}
