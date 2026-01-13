import { Injectable, Inject } from '@nestjs/common';
import type { IPlaylistRepository } from './repositories/playlist.repository.interface';
import { PLAYLIST_REPOSITORY } from '../../common/constants/tokens';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @Inject(PLAYLIST_REPOSITORY)
    private readonly playlistRepository: IPlaylistRepository,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    return this.playlistRepository.create(createPlaylistDto);
  }

  async findAll() {
    return this.playlistRepository.findAll();
  }
}
