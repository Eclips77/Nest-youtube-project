import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchLoggerService implements LoggerService {
  private readonly client: Client;
  private readonly index: string;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get<string>('ELASTICSEARCH_NODE')!,
    });
    this.index = this.configService.get<string>('ELASTICSEARCH_INDEX')!;
  }

  async log(message: any, ...optionalParams: any[]) {
    await this.sendToElastic('info', message, optionalParams);
  }

  async error(message: any, ...optionalParams: any[]) {
    await this.sendToElastic('error', message, optionalParams);
  }

  async warn(message: any, ...optionalParams: any[]) {
    await this.sendToElastic('warn', message, optionalParams);
  }

  async debug?(message: any, ...optionalParams: any[]) {
    await this.sendToElastic('debug', message, optionalParams);
  }

  async verbose?(message: any, ...optionalParams: any[]) {
    await this.sendToElastic('verbose', message, optionalParams);
  }

  private async sendToElastic(level: string, message: any, context?: any[]) {
    try {
      await this.client.index({
        index: this.index,
        document: {
          timestamp: new Date(),
          level,
          message,
          context: context || [],
        },
      });
    } catch (error) {
      // Fallback to console in case Elasticsearch is down, to avoid losing the log completely
      console.error('Failed to send log to Elasticsearch:', error);
      console.log(`[${level}] ${message}`, context);
    }
  }
}
