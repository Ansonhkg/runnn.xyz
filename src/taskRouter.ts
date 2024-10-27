import { Queue } from 'bullmq';
import { redisConnectionOptions } from './services/redis';
import { TASK_TYPES, TaskRequest } from './type';
import { debug } from './utils';

export const myQueue = new Queue(TASK_TYPES['user-task'], {
  connection: redisConnectionOptions
});

// entry point for the task router
export const routeRequest = async (req: TaskRequest) => {
  debug('[routeRequest] start');
  if (req.start.type === 'time') {
    await scheduleTask(req);
  }
  debug('[routeRequest] end');
}

export const addTaskToQueue = async (data: TaskRequest, delay?: number) => {
  debug('[addTaskToQueue] start');
  if (delay) {
    debug(`[addTaskToQueue] adding task with delay ${delay}ms`);
    return myQueue.add(TASK_TYPES['user-task'], data, { delay });
  }
  debug('[addTaskToQueue] adding task without delay');
  return myQueue.add(TASK_TYPES['user-task'], data);
};

export const scheduleTask = async (req: TaskRequest) => {
  debug('[scheduleTask] start');
  const startTime = new Date(req.start.time.startDate);
  const delay = startTime.getTime() - Date.now();

  if (delay < 0) {
    throw new Error('Start time is in the past');
  }

  debug(`[scheduleTask] scheduled to start in ${delay}ms`);

  await addTaskToQueue(req, delay);
}

