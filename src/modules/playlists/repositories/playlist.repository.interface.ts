import { Playlist } from '../schemas/playlist.schema';

export interface IPlaylistRepository {
  create(playlist: Playlist): Promise<Playlist>;
  findAll(): Promise<Playlist[]>;
  findById(id: string): Promise<Playlist | null>;
}
