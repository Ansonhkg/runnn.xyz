import { checkRequiredEnvVars, debug } from './utils';
import { myQueue } from './taskRouter';

import express, { Request, Response } from 'express';
import { ENDPOINTS, TASK_TYPES, TaskRequest, TaskSchema } from './type';

checkRequiredEnvVars();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post(ENDPOINTS['/submit-task'] as string, async (req: Request, res: Response) => {
  const taskRequest = req.body as TaskRequest;

  // validate the task request
  const validationResult = TaskSchema.safeParse(taskRequest);
  if (!validationResult.success) {
    res.status(400).json({ message: 'Invalid task request', error: validationResult.error });
  }

  try {
    await myQueue.add(TASK_TYPES['user-task'], taskRequest);
    res.status(200).json({ message: 'Task submitted successfully' });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ message: 'Failed to submit task', error: (error as Error).message });
  }
});


app.listen(PORT, () => {
  debug(`Backend Server is running on port ${PORT}`);
});
