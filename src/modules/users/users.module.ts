import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MongoUserRepository } from './repositories/mongo-user.repository';

export const USER_REPOSITORY = 'USER_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
