import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlaylistDocument = Playlist & Document;

@Schema()
export class Playlist {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  videoIds: string[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
