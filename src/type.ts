import { z } from "zod";

/**
 * @example
 * const obj = ['a', 'b', 'c']
 * ObjectMapFromArray(obj) // { a: 'a', b: 'b', c: 'c' }
 */
export const ObjectMapFromArray = <T extends readonly string[]>(arr: T) => {
  return arr.reduce(
    (acc, scope) => ({ ...acc, [scope]: scope }),
    {} as { [K in T[number]]: K }
  );
};

// ----- ENDPOINTS
export const ENDPOINTS_VALUES = [
  '/submit-task'
] as const;

export const ENDPOINTS = ObjectMapFromArray(ENDPOINTS_VALUES);

// ----- CONDITION START TYPES
export const CONDITION_START_TYPES_VALUES = [
  'time',
  'event',
  'smartContract'
] as const;

export const CONDITION_START_TYPES = ObjectMapFromArray(CONDITION_START_TYPES_VALUES);
export const CONDITION_START_SCHEMA = z.enum(CONDITION_START_TYPES_VALUES);
export type ConditionStartType = z.infer<typeof CONDITION_START_SCHEMA>;

// ----- CONDITION ACTION TYPES
export const CONDITION_ACTION_TYPES_VALUES = [
  'apiCall',
  'apiCallWithResponse',
  'apiCallWithResponseValue'
] as const;

export const CONDITION_ACTION_TYPES = ObjectMapFromArray(CONDITION_ACTION_TYPES_VALUES);
export const CONDITION_ACTION_SCHEMA = z.enum(CONDITION_ACTION_TYPES_VALUES);
export type ConditionActionType = z.infer<typeof CONDITION_ACTION_SCHEMA>;

// ----- CONDITION END TYPES
export const CONDITION_END_TYPES_VALUES = [
  'maxExecutions',
  'minExecutions'
] as const;

export const CONDITION_END_TYPES = ObjectMapFromArray(CONDITION_END_TYPES_VALUES);
export const CONDITION_END_SCHEMA = z.enum(CONDITION_END_TYPES_VALUES);
export type ConditionEndType = z.infer<typeof CONDITION_END_SCHEMA>;


// ----- Task Types
export const TASK_TYPES_VALUES = [
  'user-task'
] as const;

export const TASK_TYPES = ObjectMapFromArray(TASK_TYPES_VALUES);
export const TASK_TYPE_SCHEMA = z.enum(TASK_TYPES_VALUES);
export type TaskType = z.infer<typeof TASK_TYPE_SCHEMA>;

// ----- Task
const StartConditionSchema = z.object({
  type: CONDITION_START_SCHEMA,
  time: z.object({
    startDate: z.string().datetime(),
  })
  // add event and smartContract schemas here
})

const ActionConditionSchema = z.object({
  type: CONDITION_ACTION_SCHEMA,
  details: z.object({
    url: z.string().optional(),
    method: z.enum(["POST", "GET"]).optional(),
    responseValuePath: z.string().optional(),
    expectedValue: z.union([z.string(), z.number()]).optional(),
    comparisonOperator: z.enum([">", "<", ">=", "<=", "==", "!="]).optional(),
  })
})

const EndConditionSchema = z.object({
  type: CONDITION_END_SCHEMA,
  maxExecutions: z.number().optional(),
  minExecutions: z.number().optional(),
})

const PayloadSchema = z.object({
  code: z.string(),
  jsParams: z.any(),
})

export const TaskSchema = z.object({
  start: StartConditionSchema,
  action: ActionConditionSchema,
  end: EndConditionSchema,
  payload: PayloadSchema,
})

export type TaskRequest = z.infer<typeof TaskSchema>;
