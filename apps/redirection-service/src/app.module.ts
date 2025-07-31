import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { RedirectModule } from './redirect/redirect.module';
import configuration from './config/configuration';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis_host'),
        port: configService.get<string>('redis_port'),
        ttl: 60,
      }),
      inject: [ConfigService],
    }),
    RedirectModule,
  ],
})
export class AppModule {}
