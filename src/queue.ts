import { Queue } from 'bullmq';
import { QUEUE_TYPES } from './type';
import { redisConnectionOptions } from './services/redis';

export const myQueue = new Queue(QUEUE_TYPES.TASK_QUEUE, {
  connection: redisConnectionOptions
});