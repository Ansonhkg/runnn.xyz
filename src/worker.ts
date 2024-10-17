import { Worker } from 'bullmq';
import { redisConnectionOptions } from './services/redis';
import { QUEUE_TYPES } from './type';
import { debug } from './utils';
import { handleTask } from './taskHandler';

const worker = new Worker(QUEUE_TYPES.TASK_QUEUE, async (job) => {
  debug('Processing job:', job.id);

  debug('Job data:', job.data);

  // handle task with the provided conditions
  await handleTask(job.data);
}, {
  connection: redisConnectionOptions,
});

worker.on('completed', (job) => {
  debug('Job completed:', job.id);
});

worker.on('failed', (job, error) => {
  if (job) {
    debug('Job failed:', job.id, error);
  } else {
    debug('Job failed:', error);
  }
});

worker.on('error', (error) => {
  debug('Worker error:', error);
});

worker.on('stalled', (jobId, prev) => {
  debug('Job stalled:', jobId, prev);
});

debug('🏃‍♂️ Worker started!');