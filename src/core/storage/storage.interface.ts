/// <reference types="node" />

export interface IStorageService {
  uploadFile(file: Express.Multer.File, key: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
  getUrl(key: string): string;
}
