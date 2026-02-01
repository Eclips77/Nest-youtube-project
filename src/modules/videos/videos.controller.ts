import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { VideoSagaService } from './video-saga.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { GenreExistsPipe } from './pipes/genre-exists.pipe';
import { RollbackInterceptor } from '../../common/interceptors/rollback.interceptor';

@Controller('videos')
@UseInterceptors(RollbackInterceptor)
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly videoSagaService: VideoSagaService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body(GenreExistsPipe) createVideoDto: CreateVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.videosService.create(createVideoDto, file);
  }

  @Post('upload-saga')
  @UseInterceptors(FileInterceptor('file'))
  async createSaga(
    @Body(GenreExistsPipe) createVideoDto: CreateVideoDto,
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId: string,
  ) {
    // For demo purposes, we require a userId. In a real app, this comes from JWT/Guard.
    if (!userId) {
       // Just a dummy ID if not provided, for testing
       userId = '60d5ecb8b392d7001f4e1234';
    }
    return this.videoSagaService.processVideoUpload(createVideoDto, file, userId);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }
}
