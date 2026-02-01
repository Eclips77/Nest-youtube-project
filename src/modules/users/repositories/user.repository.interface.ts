import { User } from '../schemas/user.schema';
import { ClientSession } from 'mongoose';

export interface IUserRepository {
  create(user: User, options?: { session?: ClientSession }): Promise<User>;
  findById(id: string): Promise<User | null>;
  incrementUploadCount(id: string, options?: { session?: ClientSession }): Promise<User | null>;
}
