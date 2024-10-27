import { addTaskToQueue } from "./taskRouter";
import { TaskRequest } from "./type";
import { debug, getValueFromResponse } from "./utils";

export async function processTaskRequest(req: TaskRequest) {
  debug('Handling task:', req);
  console.log(JSON.stringify(req));
}