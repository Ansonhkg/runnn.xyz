import { TaskRequest } from "./type";
import { debug } from "./utils";

export async function processTaskRequest(req: TaskRequest) {
  debug('Handling task:', req);
  console.log(JSON.stringify(req));
}