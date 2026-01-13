import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { GenreExistsPipe } from './pipes/genre-exists.pipe';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body(GenreExistsPipe) createVideoDto: CreateVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.videosService.create(createVideoDto, file);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }
}
