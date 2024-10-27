import { REQUIRED_ENV_VARIABLES } from "./constants";

/**
 * Checks if all required environment variables are set.
 * @throws {Error} If any required environment variable is not set.
 */
export function checkRequiredEnvVars() {
  for (const envVar of REQUIRED_ENV_VARIABLES) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not set in the environment variables.`);
    }
  }
  debug('✅ All required environment variables are set.');
}

/**
 * Logs a message with a prefix and grey color using ANSI escape codes.
 * @param {string} message - The message to be logged.
 */
export function debug(...messages: any[]): void {
  const greyColor = '\x1b[90m';
  const resetColor = '\x1b[0m';
  console.log(`${greyColor}[runnn.xyz]${messages.join(' ')}`, resetColor.trim());
}

export function getValueFromResponse(responseValue: string, data: any): any {
  return responseValue.split('.').reduce((acc: any, key: string) => {
    // Match array notation like "users[0]"
    const arrayMatch = key.match(/(\w+)\[(\d+)\]/);

    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch;
      return acc?.[arrayKey]?.[parseInt(index)];
    } else {
      return acc?.[key];
    }
  }, data);
}
