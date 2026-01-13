import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

// Fix for fluent-ffmpeg import issues
const ffmpegCommand = ffmpeg as unknown as ((input: string) => ffmpeg.FfmpegCommand);

@Injectable()
export class EncodingService {
  async encodeVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
      }

      ffmpegCommand(inputPath)
        .output(outputPath)
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          console.error('Encoding error:', err);
          reject(new InternalServerErrorException(`Encoding failed: ${err.message}`));
        })
        .run();
    });
  }
}
