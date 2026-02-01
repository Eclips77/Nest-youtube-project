import { Playlist } from '../schemas/playlist.schema';
import { ClientSession } from 'mongoose';

export interface IPlaylistRepository {
  create(playlist: Playlist, options?: { session?: ClientSession }): Promise<Playlist>;
  findAll(): Promise<Playlist[]>;
  findById(id: string): Promise<Playlist | null>;
}
