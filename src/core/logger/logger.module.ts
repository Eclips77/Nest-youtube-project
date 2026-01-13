import { Module, Global } from '@nestjs/common';
import { ElasticsearchLoggerService } from './logger.service';

@Global()
@Module({
  providers: [ElasticsearchLoggerService],
  exports: [ElasticsearchLoggerService],
})
export class LoggerModule {}
