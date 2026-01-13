import { Video } from '../schemas/video.schema';

export interface IVideoRepository {
  create(video: Video): Promise<Video>;
  findAll(): Promise<Video[]>;
  findById(id: string): Promise<Video | null>;
  findByIds(ids: string[]): Promise<Video[]>;
}
