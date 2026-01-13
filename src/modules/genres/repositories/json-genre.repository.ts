import { Injectable, OnModuleInit } from '@nestjs/common';
import { IGenreRepository } from './genre.repository.interface';
import { Genre } from '../schemas/genre.schema';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JsonGenreRepository implements IGenreRepository, OnModuleInit {
  private dbPath: string;
  private filePath: string;

  constructor(private configService: ConfigService) {
      this.dbPath = this.configService.get<string>('JSON_DB_PATH', './data');
      this.filePath = path.join(this.dbPath, 'genres.json');
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

  async create(genre: Genre): Promise<Genre> {
    const genres = this.readDb();
    const newGenre = { ...genre, _id: uuidv4() };
    genres.push(newGenre);
    this.writeDb(genres);
    return newGenre;
  }

  async findAll(): Promise<Genre[]> {
    return this.readDb();
  }

  async findById(id: string): Promise<Genre | null> {
    const genres = this.readDb();
    return genres.find((g) => g._id === id) || null;
  }
}
