import { ethers } from 'ethers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { checkRequiredEnvVars } from './utils';
import { myQueue } from './queue';

// @ts-expect-error - express is not typed
import express, { Request, Response } from 'express';
import { ENDPOINTS, TASK_TYPES, TaskRequest } from './type';

checkRequiredEnvVars();

const app = express();
const PORT = process.env.PORT || 3000;

// enable JSON body parsing
app.use(express.json());

app.post(ENDPOINTS.SUBMIT_TASK, async (req: Request, res: Response) => {
  const taskRequest = req.body as Partial<TaskRequest>;

  if (!taskRequest.taskData || !taskRequest.conditions) {
    return res.status(400).json({ message: 'Missing required fields: taskData or conditions' });
  }


  try {
    await myQueue.add(TASK_TYPES.USER_TASK, taskRequest);

    res.status(200).json({ message: 'Task submitted successfully' });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ message: 'Failed to submit task', error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
