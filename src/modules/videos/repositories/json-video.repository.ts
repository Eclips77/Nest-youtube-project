import { Injectable, OnModuleInit } from '@nestjs/common';
import { IVideoRepository } from './video.repository.interface';
import { Video } from '../schemas/video.schema';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ClientSession } from 'mongoose';

@Injectable()
export class JsonVideoRepository implements IVideoRepository, OnModuleInit {
  private dbPath: string;
  private filePath: string;

  constructor(private configService: ConfigService) {
      this.dbPath = this.configService.get<string>('JSON_DB_PATH', './data');
      this.filePath = path.join(this.dbPath, 'videos.json');
  }

  onModuleInit() {
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private readDb(): any[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeDb(data: any[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async create(video: Video, options?: { session?: ClientSession }): Promise<Video> {
    // JSON Repository ignores sessions/transactions
    const videos = this.readDb();
    const newVideo = { ...video, _id: uuidv4() };
    videos.push(newVideo);
    this.writeDb(videos);
    return newVideo;
  }

  async findAll(): Promise<Video[]> {
    return this.readDb();
  }

  async findById(id: string): Promise<Video | null> {
    const videos = this.readDb();
    return videos.find((v) => v._id === id) || null;
  }

  async findByIds(ids: string[]): Promise<Video[]> {
      const videos = this.readDb();
      return videos.filter((v) => ids.includes(v._id));
  }
}
