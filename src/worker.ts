import { Job, Worker } from 'bullmq';
import { redisConnectionOptions } from './services/redis';
import { debug } from './utils';
import { processTaskRequest } from './taskProcessor';
import { TASK_TYPES, TaskRequest } from './type';

const worker = new Worker(TASK_TYPES['user-task'], async (job: Job) => {
  debug('[worker] job id:', job.id);
  await processTaskRequest(job.data);
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

// set a new listner for a new job is added


debug('🏃‍♂️ Worker started!');
