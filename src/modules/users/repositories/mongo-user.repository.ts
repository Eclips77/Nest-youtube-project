import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { IUserRepository } from './user.repository.interface';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User, options?: { session?: ClientSession }): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save({ session: options?.session });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async incrementUploadCount(id: string, options?: { session?: ClientSession }): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { $inc: { uploadCount: 1 } },
      { new: true, session: options?.session }
    ).exec();
  }
}
