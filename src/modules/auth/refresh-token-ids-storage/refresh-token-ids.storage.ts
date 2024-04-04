import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
import { uuid } from 'libs/src';
import { InvalidatedRefreshTokenError } from './invalidated-refresh-token-error.storage';

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({ host: 'localhost', port: 6379 });
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  async insert(userId: uuid, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: uuid, tokenId: string): Promise<boolean> {
    const storageId: string = await this.redisClient.get(this.getKey(userId));
    if (storageId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return true;
  }

  async invalidate(userId: uuid): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  getKey(userId: uuid): string {
    return `user-${userId}`;
  }
}
