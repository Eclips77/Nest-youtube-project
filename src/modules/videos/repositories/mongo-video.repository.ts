import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IVideoRepository } from './video.repository.interface';
import { Video, VideoDocument } from '../schemas/video.schema';

@Injectable()
export class MongoVideoRepository implements IVideoRepository {
  constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) {}

  async create(video: Video): Promise<Video> {
    const createdVideo = new this.videoModel(video);
    return createdVideo.save();
  }

  async findAll(): Promise<Video[]> {
    return this.videoModel.find().exec();
  }

  async findById(id: string): Promise<Video | null> {
    return this.videoModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Video[]> {
      return this.videoModel.find({ _id: { $in: ids } }).exec();
  }
}
