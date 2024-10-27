import { test } from 'bun:test';
import { routeRequest } from './taskRouter';
test('send a task with delay', async () => {
  await routeRequest({
    start: {
      type: 'time',
      time: {
        startDate: new Date(Date.now() + 10000).toISOString(),
      }
    },
    action: {
      type: 'apiCall',
      details: {
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET',
      }
    },
    end: {
      type: 'maxExecutions',
    },
    payload: {
      code: 'console.log("Hello, world!");',
      jsParams: {
        maxExecutions: 10,
      },
    }
  });
});

test('send a task to start immediately', async () => {
  await routeRequest({
    start: {
      type: 'time',
      time: {
        startDate: new Date(Date.now() + 10).toISOString(),
      }
    },
    action: {
      type: 'apiCall',
      details: {
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET',
      }
    },
    end: {
      type: 'maxExecutions',
    },
    payload: {
      code: 'console.log("Hello, world!");',
      jsParams: {
        maxExecutions: 10,
      },
    }
  });
});