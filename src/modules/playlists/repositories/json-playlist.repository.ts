import { Injectable, OnModuleInit } from '@nestjs/common';
import { IPlaylistRepository } from './playlist.repository.interface';
import { Playlist } from '../schemas/playlist.schema';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JsonPlaylistRepository implements IPlaylistRepository, OnModuleInit {
  private dbPath: string;
  private filePath: string;

  constructor(private configService: ConfigService) {
      this.dbPath = this.configService.get<string>('JSON_DB_PATH', './data');
      this.filePath = path.join(this.dbPath, 'playlists.json');
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

  async create(playlist: Playlist): Promise<Playlist> {
    const playlists = this.readDb();
    const newPlaylist = { ...playlist, _id: uuidv4() };
    playlists.push(newPlaylist);
    this.writeDb(playlists);
    return newPlaylist;
  }

  async findAll(): Promise<Playlist[]> {
    return this.readDb();
  }

  async findById(id: string): Promise<Playlist | null> {
    const playlists = this.readDb();
    return playlists.find((p) => p._id === id) || null;
  }
}
