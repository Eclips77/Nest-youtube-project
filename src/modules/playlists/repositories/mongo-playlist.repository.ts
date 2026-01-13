import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPlaylistRepository } from './playlist.repository.interface';
import { Playlist, PlaylistDocument } from '../schemas/playlist.schema';

@Injectable()
export class MongoPlaylistRepository implements IPlaylistRepository {
  constructor(@InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>) {}

  async create(playlist: Playlist): Promise<Playlist> {
    const createdPlaylist = new this.playlistModel(playlist);
    return createdPlaylist.save();
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistModel.find().exec();
  }

  async findById(id: string): Promise<Playlist | null> {
    return this.playlistModel.findById(id).exec();
  }
}
