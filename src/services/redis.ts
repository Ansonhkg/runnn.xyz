import { RedisOptions } from 'bullmq';
import { REDIS_HOST, REDIS_PORT } from '../constants';

export const redisConnectionOptions: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};