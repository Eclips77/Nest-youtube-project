import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FsStorageService implements IStorageService {
  private readonly uploadDir = './uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.promises.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file locally');
    }
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  getUrl(key: string): string {
    return path.join(this.uploadDir, key);
  }
}
