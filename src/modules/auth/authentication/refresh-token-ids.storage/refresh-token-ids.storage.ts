import { InvalidatedRefreshTokenError } from './invalidated-refresh-token-error.storage';
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({ host: 'localhost', port: 6379 });
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storageId: string = await this.redisClient.get(this.getKey(userId));
    if (storageId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return true;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  getKey(userId: number): string {
    return `user-${userId}`;
  }
}
