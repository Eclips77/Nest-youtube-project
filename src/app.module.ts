import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { validationSchema } from './config/validation.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbType } from './common/constants/enums';
import { LoggerModule } from './core/logger/logger.module';
import { StorageModule } from './core/storage/storage.module';
import { GenresModule } from './modules/genres/genres.module';
import { VideosModule } from './modules/videos/videos.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        if (configService.get<string>('DB_TYPE') === DbType.MONGO) {
          return {
            uri: configService.get<string>('MONGO_URI'),
          };
        }
        return {};
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    StorageModule,
    GenresModule,
    VideosModule,
    PlaylistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
