import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videoIds: string[];
}
