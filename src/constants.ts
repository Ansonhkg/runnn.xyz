export const REQUIRED_ENV_VARIABLES = [
  'NODE_ENV',
  'REDIS_HOST',
  'REDIS_PORT',
  'PORT'
];

export const REDIS_PORT = parseInt(
  process.env.REDIS_PORT || '6379');

export const REDIS_HOST = process.env.NODE_ENV === 'production' ? process.env.REDIS_HOST : 'localhost';

