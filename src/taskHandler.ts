import { TaskRequest } from "./type";
import { debug } from "./utils";

let executionCount = 0;

export async function handleTask(data: TaskRequest) {
  debug('Handling task:', data);
  const { taskData, conditions } = data;
  const { startDate, endDate, maxExecutions, minExecutions, apiConditions } = conditions;
  const { url, responseValue, comparisonValue, comparisonOperator } = apiConditions || {};


  // print all all variables
  debug('Start date:', startDate);
  debug('End date:', endDate);
  debug('Max executions:', maxExecutions);
  debug('Min executions:', minExecutions);
  debug('API conditions:', apiConditions);
  debug('URL:', url);
  debug('Response value:', responseValue);
  debug('Comparison value:', comparisonValue);
  debug('Comparison operator:', comparisonOperator);

  // current UTC time 
  const now = new Date();

  // check if the current time is within the start and end date
  if (startDate && new Date(startDate) < now) {
    throw new Error(`Start date must be after current date.`);
  }

  if (endDate && new Date(endDate) < now) {
    throw new Error(`End date must be after current date.`);
  }

  // check if the max executions is reached
  if (maxExecutions && maxExecutions <= 0) {
    throw new Error(`Max executions must be greater than 0.`);
  }

  // check if min is greater than max
  if (minExecutions && maxExecutions && minExecutions > maxExecutions) {
    throw new Error(`Min executions must be less than max executions.`);
  }

  // check if the api conditions are met
  if (apiConditions && url) {
    debug('Fetching data from:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('Response data:', data);


    // the responseValue is the path to the value we want to access in the response
    // eg. [0].postId is to access the first element in the array and then the postId
    // eg. data.foo.bar.id is to access the id in the foo object in the bar object
    const _responseValue = responseValue?.startsWith('[')
      ? eval(`data${responseValue}`)  // Safely access arrays using dynamic eval
      : responseValue?.split('.').reduce((acc: any, key: string | number) => acc?.[key], data);

    console.log('Response value:', _responseValue);

    let conditionMet = false;

    // compare the value with the comparisonValue. It could be a string or a number
    if (_responseValue !== undefined && comparisonOperator !== undefined && comparisonValue !== undefined) {
      debug('Comparing:', _responseValue, comparisonOperator, comparisonValue);
      switch (comparisonOperator) {
        case '<':
          if (typeof _responseValue === 'number' && typeof comparisonValue === 'number') {
            debug('Comparing numbers:', _responseValue, '<', comparisonValue);
            conditionMet = _responseValue < comparisonValue;
          }
          break;
        case '<=':
          if (typeof _responseValue === 'number' && typeof comparisonValue === 'number') {
            debug('Comparing numbers:', _responseValue, '<=', comparisonValue);
            conditionMet = _responseValue <= comparisonValue;
          }
          break;
        case '>':
          if (typeof _responseValue === 'number' && typeof comparisonValue === 'number') {
            debug('Comparing numbers:', _responseValue, '>', comparisonValue);
            conditionMet = _responseValue > comparisonValue;
          }
          break;
        case '>=':
          if (typeof _responseValue === 'number' && typeof comparisonValue === 'number') {
            debug('Comparing numbers:', _responseValue, '>=', comparisonValue);
            conditionMet = _responseValue >= comparisonValue;
          }
          break;
        case '==':
          debug('Comparing values:', _responseValue, '==', comparisonValue);
          conditionMet = (
            (typeof _responseValue === 'number' && typeof comparisonValue === 'number' && _responseValue === comparisonValue) ||
            (typeof _responseValue === 'string' && typeof comparisonValue === 'string' && _responseValue === comparisonValue)
          );
          break;
        case '!=':
          debug('Comparing values:', _responseValue, '!=', comparisonValue);
          conditionMet = (
            (typeof _responseValue === 'number' && typeof comparisonValue === 'number' && _responseValue !== comparisonValue) ||
            (typeof _responseValue === 'string' && typeof comparisonValue === 'string' && _responseValue !== comparisonValue)
          );
          break;
        default:
          debug('Invalid comparison operator:', comparisonOperator);
          throw new Error(`Invalid comparison operator: ${comparisonOperator}`);
      }
      
      if (conditionMet) {
        debug('✅ Condition met:', _responseValue, comparisonOperator, comparisonValue);
      } else {
        debug('❌ Condition not met:', _responseValue, comparisonOperator, comparisonValue);
      }
    }

    // Simulate task execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Increment execution count
    executionCount++;

    return conditionMet;
  }
}