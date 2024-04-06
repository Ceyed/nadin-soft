import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConfig, redisConfig } from 'src/app/configs/redis.config';
import { RedisHelperService } from './redis-helper.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (redisConfigService: RedisConfig): RedisModuleOptions => ({
        config: {
          host: redisConfigService.host,
          port: redisConfigService.port,
        },
      }),
      inject: [redisConfig.KEY],
      imports: [ConfigModule.forFeature(redisConfig)],
    }),
  ],
  providers: [RedisHelperService],
  exports: [RedisHelperService],
})
export class RedisHelperModule {}
