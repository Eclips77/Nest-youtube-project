import { Video } from '../schemas/video.schema';
import { ClientSession } from 'mongoose';

export interface IVideoRepository {
  create(video: Video, options?: { session?: ClientSession }): Promise<Video>;
  findAll(): Promise<Video[]>;
  findById(id: string): Promise<Video | null>;
  findByIds(ids: string[]): Promise<Video[]>;
}
