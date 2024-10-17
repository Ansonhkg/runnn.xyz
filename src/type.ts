export interface TaskRequest {
  taskData: any; // TODO: define this
  conditions: {
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    maxExecutions?: number;
    minExecutions?: number;
    apiConditions?: {
      url: string,
      responseValue: string; // the value to access in the api response eg data.id
      comparisonOperator: '<' | '<=' | '>' | '>=' | '==' | '!=';
      comparisonValue: string | number,
    };
  }
}

export const QUEUE_TYPES = {
  TASK_QUEUE: 'task-queue',
} as const;

export type QueueType = (typeof QUEUE_TYPES)[keyof typeof QUEUE_TYPES];

export const TASK_TYPES = {
  USER_TASK: 'user-task',
} as const;

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];

export const ENDPOINTS = {
  SUBMIT_TASK: '/submit-task',
} as const;

export type Endpoint = (typeof ENDPOINTS)[keyof typeof ENDPOINTS];