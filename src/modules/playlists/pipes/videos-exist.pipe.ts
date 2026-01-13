import { PipeTransform, Injectable, BadRequestException, Inject } from '@nestjs/common';
import { VIDEO_REPOSITORY } from '../../../common/constants/tokens';
import type { IVideoRepository } from '../../videos/repositories/video.repository.interface';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';

@Injectable()
export class VideosExistPipe implements PipeTransform {
  constructor(
    @Inject(VIDEO_REPOSITORY)
    private readonly videoRepository: IVideoRepository,
  ) {}

  async transform(value: CreatePlaylistDto) {
    if (!value.videoIds || value.videoIds.length === 0) {
      return value;
    }

    const foundVideos = await this.videoRepository.findByIds(value.videoIds);
    if (foundVideos.length !== value.videoIds.length) {
        // Find which IDs are missing for better error message
        const foundIds = foundVideos.map(v => v['_id'] ? v['_id'].toString() : v['id']); // Handle mongoose vs json differences
        const missingIds = value.videoIds.filter(id => !foundIds.includes(id));
        throw new BadRequestException(`Videos with IDs ${missingIds.join(', ')} do not exist`);
    }

    return value;
  }
}
