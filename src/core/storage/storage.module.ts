import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FsStorageService } from './fs-storage.service';
import { S3StorageService } from './s3-storage.service';
import { STORAGE_SERVICE } from '../../common/constants/tokens';
import { StorageType } from '../../common/constants/enums';

const storageFactory = {
  provide: STORAGE_SERVICE,
  useFactory: (configService: ConfigService) => {
    const storageType = configService.get<string>('STORAGE_TYPE');
    if (storageType === StorageType.S3) {
      return new S3StorageService(configService);
    }
    return new FsStorageService();
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [storageFactory],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
