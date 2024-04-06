import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis, { ChainableCommander } from 'ioredis';
import { RedisPrefixesEnum, RedisSubPrefixesEnum } from '../../enums';
import { uuid } from '../../constants';

@Injectable()
export class RedisHelperService {
  constructor(@InjectRedis() private readonly _redisClient: Redis) {}

  get pipeLine(): ChainableCommander {
    return this._redisClient.multi();
  }

  getStandardKey(
    keyPrefix: RedisPrefixesEnum,
    subPrefix: RedisSubPrefixesEnum,
    id: uuid,
  ): string {
    return keyPrefix + ':' + subPrefix + ':' + id;
  }

  getStandardKeyWithoutId(
    keyPrefix: RedisPrefixesEnum,
    subPrefix: RedisSubPrefixesEnum,
  ): string {
    return keyPrefix + ':' + subPrefix;
  }

  getPatternKey(
    keyPrefix: RedisPrefixesEnum,
    subPrefix?: RedisSubPrefixesEnum,
  ): string {
    let pattern = keyPrefix + ':';
    if (subPrefix) pattern += subPrefix + ':';
    return pattern + '*';
  }

  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringFormat = JSON.stringify(value);
    await this._redisClient.set(key, stringFormat);
    if (ttl) {
      await this._redisClient.expire(key, ttl);
    }
  }

  async getCache<T>(key: string): Promise<T> {
    const cachedKey = await this._redisClient.get(key);
    if (cachedKey) {
      return JSON.parse(cachedKey) as T;
    }
  }

  async removeCache(key: string) {
    await this._redisClient.del(key);
  }

  async deleteByPattern(pattern: string) {
    const keys = await this._redisClient.keys(pattern);
    if (keys?.length) {
      await this._redisClient.del(keys);
    }
  }

  /**
   * This function checks to see if there is data with your key in redis, else will
   * fetch it from db and store it as cache if it does not exists it will return null
   * @param key: Your redis key
   * @param getDataCallback: The function and repo query to get your data
   */
  async getFromCacheOrDb<T>(
    key: string,
    getDataCallback: () => Promise<T>,
  ): Promise<T> {
    const valueFromRedis = await this.getCache<T>(key);
    if (valueFromRedis) return valueFromRedis;

    const valueFromDb = await getDataCallback();
    if (!valueFromDb) return;

    this.setCache<T>(key, valueFromDb);
    return valueFromDb;
  }
}
